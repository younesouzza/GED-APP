import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreateIcon from '@mui/icons-material/Create';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import './inbox.css';

export default function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Albert', subject: 'Updated Document', date: 'Apr 14, 2025', read: true, flagged: false, content: "I've updated the document with the latest changes. Please review when you have time." },
    { id: 2, sender: 'Mike', subject: 'Birth certificate', date: 'Apr 13, 2025', read: false, flagged: true, content: "Attached is the birth certificate you requested. Let me know if you need anything else." },
    { id: 3, sender: 'Jhon', subject: 'Rapport', date: 'Apr 12, 2025', read: true, flagged: false, content: "Here's the quarterly rapport. The numbers look good for this quarter." },
    { id: 4, sender: 'Sarah', subject: 'Meeting Schedule', date: 'Apr 11, 2025', read: false, flagged: false, content: "Our team meeting has been rescheduled to next Thursday at 2 PM. Please confirm your attendance." },
    { id: 5, sender: 'Team Admin', subject: 'Weekly Update', date: 'Apr 10, 2025', read: true, flagged: true, content: "This week's progress: Project A is 80% complete. Project B needs attention." },
    { id: 6, sender: 'System', subject: 'Password Reset', date: 'Apr 9, 2025', read: true, flagged: false, content: "Your password has been reset successfully. If you didn't request this change, please contact support." },
  ]);
  
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    attachments: []
  });

  // Filter messages based on current filter and search term
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "unread") return !message.read && matchesSearch;
    if (filter === "flagged") return message.flagged && matchesSearch;
    
    return matchesSearch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMessageClick = (id) => {
    setSelectedMessage(id === selectedMessage ? null : id);
    // Mark message as read when clicked
    if (id !== selectedMessage) {
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    }
  };

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
  };

  const handleRefresh = () => {
    // Simulate refresh with a small delay
    const refreshButton = document.querySelector('.secondaryButton');
    refreshButton.disabled = true;
    refreshButton.innerHTML = 'Refreshing...';
    
    setTimeout(() => {
      refreshButton.disabled = false;
      refreshButton.innerHTML = 'Refresh';
    }, 1000);
  };

  const handleCompose = () => {
    setShowComposeModal(true);
  };

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    
    
    const newId = Math.max(...messages.map(m => m.id)) + 1;
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const attachmentInfo = newMessage.attachments.length > 0 
      ? `\n\nAttachments (${newMessage.attachments.length}): ${newMessage.attachments.map(file => file.name).join(', ')}`
      : '';
    
    setMessages([
      {
        id: newId,
        sender: 'Me',
        subject: newMessage.subject,
        date: currentDate,
        read: true,
        flagged: false,
        content: newMessage.content + attachmentInfo,
        hasAttachments: newMessage.attachments.length > 0
      },
      ...messages
    ]);
    
    
    setShowComposeModal(false);
    setNewMessage({ recipient: '', subject: '', content: '', attachments: [] });
  };

  const handleDeleteMessage = (id, e) => {
    e.stopPropagation();
    setMessages(messages.filter(msg => msg.id !== id));
    
    if (selectedMessage === id) {
      setSelectedMessage(null);
    }
  };

  const handleDownload = (id, e) => {
    e.stopPropagation();
    const message = messages.find(m => m.id === id);
    
    
    const element = document.createElement("a");
    const file = new Blob([
      `From: ${message.sender}\n`,
      `Subject: ${message.subject}\n`,
      `Date: ${message.date}\n\n`,
      message.content
    ], {type: 'text/plain'});
    
    element.href = URL.createObjectURL(file);
    element.download = `message-${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleToggleFlag = (id, e) => {
    e.stopPropagation();
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, flagged: !msg.flagged } : msg
    ));
    setShowMoreMenu(null);
  };

  const handleMarkUnread = (id, e) => {
    e.stopPropagation();
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: false } : msg
    ));
    setShowMoreMenu(null);
  };

  const handleMoreClick = (id, e) => {
    e.stopPropagation();
    setShowMoreMenu(showMoreMenu === id ? null : id);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewMessage({
      ...newMessage,
      attachments: [...newMessage.attachments, ...files]
    });
  };

  const handleRemoveFile = (index) => {
    const updatedAttachments = [...newMessage.attachments];
    updatedAttachments.splice(index, 1);
    setNewMessage({
      ...newMessage,
      attachments: updatedAttachments
    });
  };

 
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMoreMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='inboxPage'>
      <div className='inboxHeader'>
        <h1>Inbox</h1>
        <div className='inboxActions'>
          <button className='primaryButton' onClick={handleCompose}>
            <CreateIcon fontSize="small" style={{ marginRight: '5px' }} />
            Compose
          </button>
          <button className='secondaryButton' onClick={handleRefresh}>
            <RefreshIcon fontSize="small" style={{ marginRight: '5px' }} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className='messageFilters'>
        <div className='filterTabs'>
          <button 
            className={`filterTab ${filter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All
          </button>
          <button 
            className={`filterTab ${filter === "unread" ? "active" : ""}`}
            onClick={() => handleFilterClick("unread")}
          >
            Unread
          </button>
          <button 
            className={`filterTab ${filter === "flagged" ? "active" : ""}`}
            onClick={() => handleFilterClick("flagged")}
          >
            Flagged
          </button>
        </div>
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className='messagesList'>
        {filteredMessages.length > 0 ? (
          filteredMessages.map(message => (
            <div 
              key={message.id} 
              className={`messageItem ${!message.read ? 'unread' : ''} ${selectedMessage === message.id ? 'selected' : ''} ${message.flagged ? 'flagged' : ''}`}
              onClick={() => handleMessageClick(message.id)}
            >
              <div className='messageDot'>
                {!message.read && <span className='unreadDot'></span>}
              </div>
              <div className='messageSender'>{message.sender}</div>
              <div className='messageSubject'>
                {message.subject}
                {message.hasAttachments && (
                  <span className="attachmentIndicator">
                    <AttachFileIcon fontSize="small" style={{ fontSize: '14px', marginLeft: '5px' }} />
                  </span>
                )}
              </div>
              <div className='messageDate'>{message.date}</div>
              <div className='messageActions'>
                <button className='iconButton' onClick={(e) => handleDeleteMessage(message.id, e)}>
                  <DeleteOutlineIcon fontSize="small" />
                </button>
                <button className='iconButton' onClick={(e) => handleDownload(message.id, e)}>
                  <FileDownloadIcon fontSize="small" />
                </button>
                <div className='moreOptionsContainer'>
                  <button className='iconButton' onClick={(e) => handleMoreClick(message.id, e)}>
                    <MoreHorizIcon fontSize="small" />
                  </button>
                  
                  {showMoreMenu === message.id && (
                    <div className='moreMenu'>
                      <button className='menuItem' onClick={(e) => handleMarkUnread(message.id, e)}>
                        Mark as {message.read ? 'unread' : 'read'}
                      </button>
                      <button className='menuItem' onClick={(e) => handleToggleFlag(message.id, e)}>
                        {message.flagged ? 'Remove flag' : 'Flag message'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='emptyState'>
            <p>No messages found</p>
          </div>
        )}
      </div>
      
      {selectedMessage && (
        <div className='messagePreview'>
          <div className='previewHeader'>
            <h2>{messages.find(m => m.id === selectedMessage).subject}</h2>
            <div className='previewActions'>
              <button className='iconButton' title="Reply">
                <ChatBubbleOutlineIcon fontSize="small" />
              </button>
              <button className='iconButton' title="Expand">
                <OpenInFullIcon fontSize="small" />
              </button>
              <button 
                className='iconButton' 
                title="Download"
                onClick={(e) => handleDownload(selectedMessage, e)}
              >
                <FileDownloadIcon fontSize="small" />
              </button>
            </div>
          </div>
          <div className='messageInfo'>
            <div className='infoItem'>
              <span className='infoLabel'>From:</span>
              <span className='infoValue'>{messages.find(m => m.id === selectedMessage).sender}</span>
            </div>
            <div className='infoItem'>
              <span className='infoLabel'>Date:</span>
              <span className='infoValue'>{messages.find(m => m.id === selectedMessage).date}</span>
            </div>
          </div>
          <div className='messageContent'>
            <p>{messages.find(m => m.id === selectedMessage).content}</p>
          </div>
        </div>
      )}
      
      <div className='pagination'>
        <button className='paginationButton' disabled>Previous</button>
        <span className='paginationInfo'>1-{filteredMessages.length} of {filteredMessages.length}</span>
        <button className='paginationButton' disabled>Next</button>
      </div>
      
      {showComposeModal && (
        <div className='modalOverlay'>
          <div className='composeModal'>
            <div className='modalHeader'>
              <h2>Compose Message</h2>
              <button 
                className='closeButton'
                onClick={() => setShowComposeModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleComposeSubmit}>
              <div className='formGroup'>
                <label>To:</label>
                <input 
                  type="text" 
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  required
                />
              </div>
              <div className='formGroup'>
                <label>Subject:</label>
                <input 
                  type="text" 
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  required
                />
              </div>
              <div className='formGroup'>
                <label>Message:</label>
                <textarea 
                  rows="6"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  required
                ></textarea>
              </div>
              
              <div className='formGroup attachmentGroup'>
                <div className='fileUploadContainer'>
                  <label htmlFor="fileUpload" className='fileUploadLabel'>
                    <AttachFileIcon fontSize="small" />
                    Attach Files
                  </label>
                  <input 
                    type="file" 
                    id="fileUpload" 
                    className='fileUploadInput'
                    onChange={handleFileUpload}
                    multiple
                  />
                </div>
                
                {newMessage.attachments.length > 0 && (
                  <div className='attachmentChips'>
                    {newMessage.attachments.map((file, index) => (
                      <div key={index} className='attachmentChip'>
                        <span className='attachmentName' title={file.name}>
                          {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                        </span>
                        <button 
                          type='button'
                          className='chipRemoveButton'
                          onClick={() => handleRemoveFile(index)}
                        >
                          <CloseIcon style={{ fontSize: '12px' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className='formActions'>
                <button type="submit" className='primaryButton'>Send</button>
                <button 
                  type="button" 
                  className='secondaryButton'
                  onClick={() => setShowComposeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}