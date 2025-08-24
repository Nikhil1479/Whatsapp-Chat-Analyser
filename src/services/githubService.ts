import { ChatData } from '../types/ChatTypes';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

interface GitHubFile {
  name: string;
  path: string;
  content: string;
  message: string;
}

export class GitHubService {
  private config: GitHubConfig;

  constructor(token: string, owner: string, repo: string = 'chats') {
    this.config = {
      token,
      owner,
      repo
    };
  }

  /**
   * Upload a chat file to GitHub repository
   */
  async uploadChatFile(originalFileName: string, fileContent: string, chatData: ChatData): Promise<string> {
    try {
      // Generate a unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedFileName}`;
      const filePath = `uploads/${fileName}`;

      // Create file metadata
      const metadata = {
        uploadedAt: new Date().toISOString(),
        originalFileName,
        participants: chatData.participants,
        totalMessages: chatData.totalMessages,
        dateRange: {
          start: chatData.dateRange.start.toISOString(),
          end: chatData.dateRange.end.toISOString()
        },
        totalDays: chatData.totalDays
      };

      // Create a combined content with metadata
      const fileWithMetadata = {
        metadata,
        content: fileContent
      };

      const githubFile: GitHubFile = {
        name: fileName,
        path: filePath,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(fileWithMetadata, null, 2)))), // Base64 encode
        message: `Upload chat file: ${originalFileName} (${chatData.totalMessages} messages)`
      };

      const url = await this.createFile(githubFile);
      console.log('✅');
      return url;
    } catch (error) {
      console.error('❌', error);
      throw error;
    }
  }

  /**
   * Create a file in the GitHub repository
   */
  private async createFile(file: GitHubFile): Promise<string> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: file.message,
        content: file.content,
        branch: 'main' // or 'master' depending on your default branch
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
    }

    const result = await response.json();
    return result.content.html_url;
  }

  /**
   * Check if the repository exists and is accessible
   */
  async validateRepository(): Promise<boolean> {
    try {
      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Repository validation failed:', error);
      return false;
    }
  }

  /**
   * Create the chats repository if it doesn't exist
   */
  async createRepository(): Promise<boolean> {
    try {
      const url = `https://api.github.com/user/repos`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.config.repo,
          description: 'Repository for storing WhatsApp chat exports from Chat Analyzer',
          private: true, // Make it private by default for privacy
          auto_init: true
        })
      });

      if (response.status === 201) {
        console.log('✅ Repository created successfully');
        return true;
      } else if (response.status === 422) {
        // Repository already exists
        console.log('ℹ️ Repository already exists');
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to create repository:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating repository:', error);
      return false;
    }
  }

  /**
   * List all uploaded chat files
   */
  async listChatFiles(): Promise<Array<{ name: string; url: string; uploadedAt: string }>> {
    try {
      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/uploads`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return []; // uploads folder doesn't exist yet
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const files = await response.json();
      return files.map((file: any) => ({
        name: file.name,
        url: file.html_url,
        uploadedAt: file.name.split('_')[0] // Extract timestamp from filename
      }));
    } catch (error) {
      console.error('Error listing chat files:', error);
      return [];
    }
  }
}

// Utility function to get GitHub service instance
export const createGitHubService = (token: string, owner: string): GitHubService => {
  return new GitHubService(token, owner);
};

// Export for use in components
export default GitHubService;
