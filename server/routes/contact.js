const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { validateContact } = require('../middleware/validation');

// Submit contact form
router.post('/', validateContact, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      data: {
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
          createdAt: contact.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Add status filter
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalContacts: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// Get all contact messages for a given email (public)
router.get('/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    const contacts = await Contact.findAll({
      where: { email },
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      data: { contacts }
    });
  } catch (error) {
    console.error('Error fetching contacts by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages by email'
    });
  }
});

// Get contact message by ID (admin only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        contact
      }
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
});

// Mark contact as read (admin only)
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.markAsRead();
    
    res.json({
      success: true,
      message: 'Contact marked as read',
      data: {
        contact: {
          id: contact.id,
          status: contact.status
        }
      }
    });
  } catch (error) {
    console.error('Error marking contact as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark contact as read'
    });
  }
});

// Reply to contact (admin only)
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;
    
    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.markAsReplied(replyMessage);
    
    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        contact: {
          id: contact.id,
          status: contact.status,
          repliedAt: contact.repliedAt
        }
      }
    });
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
});

// Archive contact (admin only)
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.archive();
    
    res.json({
      success: true,
      message: 'Contact archived successfully',
      data: {
        contact: {
          id: contact.id,
          status: contact.status
        }
      }
    });
  } catch (error) {
    console.error('Error archiving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive contact'
    });
  }
});

// Delete contact (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.destroy();
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

// Get contact statistics (admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Contact.getStats();
    
    // Get recent contacts
    const recentContacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'subject', 'status', 'createdAt']
    });
    
    res.json({
      success: true,
      data: {
        stats,
        recentContacts
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
});

module.exports = router; 