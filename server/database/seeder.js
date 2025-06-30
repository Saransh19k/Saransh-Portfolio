const { sequelize } = require('../config/database');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const User = require('../models/User');

const sampleBlogPosts = [
  {
    title: 'Building a Modern Portfolio with React and Node.js',
    slug: 'building-modern-portfolio-react-nodejs',
    excerpt: 'Learn how to create a stunning portfolio website using React for the frontend and Node.js with SQL for the backend.',
    content: `
# Building a Modern Portfolio with React and Node.js

Creating a portfolio website is an essential step for any developer looking to showcase their work and skills. In this comprehensive guide, we'll walk through building a modern, responsive portfolio using React for the frontend and Node.js with SQL for the backend.

## Why React and Node.js?

React provides a powerful component-based architecture that makes building interactive user interfaces straightforward and maintainable. Node.js, on the other hand, offers excellent performance for building scalable backend APIs.

## Key Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Blog System**: Integrated blog with markdown support
- **Contact Form**: Functional contact form with email notifications
- **Project Showcase**: Beautiful project gallery with filtering
- **SEO Optimized**: Built with search engine optimization in mind

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D effects

### Backend
- Node.js with Express
- SQLite for development (PostgreSQL for production)
- Sequelize ORM
- JWT for authentication

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up the database
4. Configure environment variables
5. Start the development server

## Conclusion

Building a portfolio website is a great way to demonstrate your skills and attract potential clients or employers. With the right tools and approach, you can create something truly impressive.

Remember to keep your portfolio updated with your latest projects and skills!
    `,
    featuredImage: '/images/blog/modern-portfolio.jpg',
    tags: ['React', 'Node.js', 'Portfolio', 'Web Development'],
    category: 'Development',
    authorName: 'Saransh Nimje',
    authorAvatar: '/images/avatar.jpg',
    readTime: 8,
    views: 1250,
    likes: 89,
    status: 'published',
    publishedAt: new Date('2024-01-15')
  },
  {
    title: 'The Future of Web Development: AI-Powered Tools',
    slug: 'future-web-development-ai-powered-tools',
    excerpt: 'Explore how artificial intelligence is revolutionizing web development and what tools you should be learning.',
    content: `
# The Future of Web Development: AI-Powered Tools

Artificial Intelligence is transforming every industry, and web development is no exception. From code generation to automated testing, AI tools are becoming an integral part of the modern developer's toolkit.

## Current AI Tools in Web Development

### 1. Code Generation
- GitHub Copilot
- Amazon CodeWhisperer
- Tabnine

### 2. Design Tools
- Figma's AI features
- Adobe's AI-powered design tools
- Automated UI generation

### 3. Testing and Debugging
- AI-powered test generation
- Automated bug detection
- Performance optimization

## Benefits of AI in Web Development

- **Increased Productivity**: Generate boilerplate code quickly
- **Reduced Errors**: AI can catch common mistakes
- **Faster Learning**: AI assistants can explain complex concepts
- **Better Code Quality**: AI suggestions often follow best practices

## Challenges and Considerations

While AI tools are powerful, they're not without challenges:

- **Over-reliance**: Don't become dependent on AI
- **Code Quality**: Always review AI-generated code
- **Learning Curve**: Takes time to learn how to use AI effectively
- **Cost**: Some AI tools can be expensive

## The Future Outlook

The future of web development with AI looks promising. We can expect:

- More sophisticated code generation
- Better integration with development workflows
- AI-powered project management
- Automated deployment and optimization

## Conclusion

AI is here to stay in web development. The key is to embrace these tools while maintaining your core development skills. Use AI as a productivity enhancer, not a replacement for understanding the fundamentals.
    `,
    featuredImage: '/images/blog/ai-web-development.jpg',
    tags: ['AI', 'Web Development', 'Future Tech', 'Productivity'],
    category: 'Technology',
    authorName: 'Saransh Nimje',
    authorAvatar: '/images/avatar.jpg',
    readTime: 6,
    views: 890,
    likes: 67,
    status: 'published',
    publishedAt: new Date('2024-01-10')
  },
  {
    title: 'Mastering TypeScript: A Comprehensive Guide',
    slug: 'mastering-typescript-comprehensive-guide',
    excerpt: 'Dive deep into TypeScript and learn how to write more robust, maintainable JavaScript code.',
    content: `
# Mastering TypeScript: A Comprehensive Guide

TypeScript has become the de facto standard for large-scale JavaScript applications. In this comprehensive guide, we'll explore everything you need to know to master TypeScript.

## What is TypeScript?

TypeScript is a superset of JavaScript that adds static typing, making your code more reliable and easier to maintain. It compiles down to regular JavaScript, so it works everywhere JavaScript works.

## Key Features

### 1. Static Typing
TypeScript's type system helps catch errors at compile time:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(user: User): User {
  return user;
}
\`\`\`

### 2. Advanced Types
TypeScript offers powerful type features:

- Union Types
- Intersection Types
- Generic Types
- Conditional Types

### 3. Better IDE Support
With TypeScript, you get:
- Intelligent autocomplete
- Refactoring tools
- Error detection
- Better documentation

## Best Practices

1. **Start Small**: Don't try to convert everything at once
2. **Use Strict Mode**: Enable strict type checking
3. **Leverage Types**: Create interfaces for your data structures
4. **Avoid Any**: Use specific types instead of 'any'
5. **Document with Types**: Let types serve as documentation

## Migration Strategy

If you're migrating from JavaScript:

1. Rename files to .ts
2. Fix type errors gradually
3. Enable strict mode
4. Add type definitions
5. Refactor for better type safety

## Conclusion

TypeScript is an investment in code quality and developer productivity. While there's a learning curve, the benefits far outweigh the initial effort.
    `,
    featuredImage: '/images/blog/typescript-guide.jpg',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Tutorial'],
    category: 'Tutorial',
    authorName: 'Saransh Nimje',
    authorAvatar: '/images/avatar.jpg',
    readTime: 12,
    views: 2100,
    likes: 156,
    status: 'published',
    publishedAt: new Date('2024-01-05')
  }
];

const sampleContacts = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    subject: 'Project Collaboration Opportunity',
    message: 'Hi Saransh, I came across your portfolio and was impressed by your work. I have a project that I think would be a great fit for your skills. Would you be interested in discussing a potential collaboration?',
    status: 'new',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date('2024-01-20')
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcompany.com',
    subject: 'Job Opportunity - Senior Developer',
    message: 'Hello Saransh, I\'m a recruiter at TechCorp and we\'re looking for a senior full-stack developer. Your portfolio shows exactly the kind of experience we need. Are you currently open to new opportunities?',
    status: 'read',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: new Date('2024-01-18')
  },
  {
    name: 'Mike Chen',
    email: 'mike.chen@startup.io',
    subject: 'Freelance Project Inquiry',
    message: 'Hi there! I\'m the founder of a startup and we need help building our MVP. Your React and Node.js experience looks perfect for what we need. What are your rates and availability?',
    status: 'replied',
    ipAddress: '172.16.0.200',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    repliedAt: new Date('2024-01-19'),
    replyMessage: 'Hi Mike, thanks for reaching out! I\'d be happy to discuss your project. Let\'s schedule a call to go over the details.',
    createdAt: new Date('2024-01-17')
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');
    
    // Create default developer user
    const developerUser = await User.createUser({
      firstName: 'Saransh',
      lastName: 'Nimje',
      email: 'admin@portfolio.com',
      password: 'Developer2024!',
      role: 'developer'
    });

    console.log('✅ Developer user created:', developerUser.email);
    
    // Seed blog posts
    await Blog.bulkCreate(sampleBlogPosts);
    console.log('✅ Sample blog posts created');
    
    // Seed contacts
    await Contact.bulkCreate(sampleContacts);
    console.log('✅ Sample contacts created');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${sampleBlogPosts.length} blog posts`);
    console.log(`📊 Created ${sampleContacts.length} contact messages`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...');
    
    // Drop all tables
    await sequelize.drop();
    console.log('✅ Database cleared');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clear') {
    clearDatabase()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    seedDatabase()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = {
  seedDatabase,
  clearDatabase
}; 