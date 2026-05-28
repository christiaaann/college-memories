import { useState, useEffect, useRef } from 'react'
import image1 from './assets/image1.jpg'
import image2 from './assets/image2.jpg'
import image3 from './assets/image3.jpg'
import image4 from './assets/image4.jpg'
import image5 from './assets/image5.jpg'
import image6 from './assets/image6.jpg'
import image7 from './assets/image7.jpg'
import image8 from './assets/image8.jpg'
import image9 from './assets/image9.jpg'
import image10 from './assets/image10.jpg'
import image11 from './assets/image11.jpg'
import image12 from './assets/image12.jpg'
import image13 from './assets/image13.jpg'
import image14 from './assets/image14.jpg'
import image15 from './assets/image15.jpg'
import image16 from './assets/image16.jpg'
import image17 from './assets/image17.jpg'
import image18 from './assets/image18.jpg'
import image19 from './assets/image19.jpg'
import image20 from './assets/image20.jpg'
import image21 from './assets/image21.jpg'
import image22  from './assets/image22.jpg'
import image23 from './assets/image23.jpg'
import image24 from './assets/image24.jpg'
import image25 from './assets/image25.jpg'
import image26 from './assets/image26.jpg'
import image27 from './assets/image27.jpg'
import image28 from './assets/image28.jpg'
import image29 from './assets/image29.jpg'
import image30 from './assets/image30.jpg'
import image31 from './assets/image31.jpg'

import video1 from './assets/video1.mp4'
import video2 from './assets/video2.mp4'
import video3 from './assets/video3.mp4'
import video4 from './assets/video4.mp4'
import video5 from './assets/video5.mp4'

import christian from './assets/christian.jpg'
import nico from './assets/nico.jpg'
import jane from './assets/jane.jpg'
import patricia from './assets/patricia.jpg'
import zara from './assets/zara.jpg'
import lyn from './assets/lyn.jpg'
import analeth from './assets/analeth.jpg'
import elimina from './assets/elimina.jpg'
import jinky from './assets/jinky.jpg'
import bea from './assets/bea.jpg'
import { Volume2, VolumeOff, Trash2, ChevronLeft, ChevronRight, AlertTriangle, X, MessageSquare, Send, Edit3, Check } from 'lucide-react'

import { db } from './services/firebase'
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, serverTimestamp, runTransaction } from 'firebase/firestore'

function App() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const videoRefs = useRef({});

  const toggleMute = (index) => {
    setActiveVideoIndex((prevIndex) => {
      const nextIndex = prevIndex === index ? null : index;
      Object.keys(videoRefs.current).forEach((key) => {
        const video = videoRefs.current[key];
        if (video) {
          video.muted = parseInt(key) !== nextIndex;
        }
      });
      return nextIndex;
    });
  };

  const [graduates] = useState([
    { id: 1, name: "Christian P. Heje", course: "BS Information Technology", quote: "Strive for greatness. The journey is just beginning.", image: christian },
    { id: 2, name: "Nico Jay Balonso", course: "BS Information Technology", quote: "The future belongs to those who believe in the beauty of their dreams.", image: nico },
    { id: 3, name: "Jane Enfal Balderama", course: "BS Information Technology", quote: "Simple things done well. Code is poetry.", image: jane },
    { id: 4, name: "Patricia Cambe", course: "BS Information Technology", quote: "Dream big, work hard, and stay humble through it all.", image: patricia },
    { id: 5, name: "Zara Gapas", course: "BS Information Technology", quote: "Consistency beats talent when talent doesn't work hard.", image: zara },
    { id: 6, name: "Lyn Garrote", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: lyn },
    { id: 7, name: "Analeth Garrote", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: analeth },
    { id: 8, name: "Elmina Gepiga", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: elimina },
    { id: 9, name: "Jinky Dublin", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: jinky },
    { id: 10, name: "Bea Barcelona", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: bea },
  ])

  // --- GLOBAL AUTHOR / INITIAL NAME PROMPT LOGIC ---
  const [globalAuthor, setGlobalAuthor] = useState(() => {
    return localStorage.getItem('user_display_name') || '';
  });
  const [nameInput, setNameInput] = useState('');

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    localStorage.setItem('user_display_name', nameInput.trim());
    setGlobalAuthor(nameInput.trim());
  };

  // --- FIREBASE FIRESTORE LOGIC ---
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  
  // Comment editing local states
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const [myPostIds, setMyPostIds] = useState(() => {
    const savedIds = localStorage.getItem('my_created_posts');
    return savedIds ? JSON.parse(savedIds) : [];
  });

  const [myReactions, setMyReactions] = useState(() => {
    const savedReactions = localStorage.getItem('my_reactions');
    return savedReactions ? JSON.parse(savedReactions) : {}; 
  });

  const [formData, setFormData] = useState({ title: '', body: '' });
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Realtime Data Fetch mula sa Firestore
  useEffect(() => {
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages from firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('my_created_posts', JSON.stringify(myPostIds));
  }, [myPostIds]);

  useEffect(() => {
    localStorage.setItem('my_reactions', JSON.stringify(myReactions));
  }, [myReactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!globalAuthor || !formData.body || !formData.title || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const messagesCollection = collection(db, 'messages');
      const docRef = await addDoc(messagesCollection, {
        title: formData.title,
        body: formData.body,
        author: globalAuthor,
        reactions: { heart: 0, haha: 0 }, 
        comments: [], 
        createdAt: serverTimestamp()
      });

      setMyPostIds(prev => [...prev, docRef.id]);
      setFormData({ title: '', body: '' });
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- OPTIMISTIC REACTION HANDLER ---
  const handleToggleReaction = async (e, messageId, reactionType) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); 
    }
    
    const hasReacted = myReactions[messageId]?.[reactionType] || false;

    setMyReactions(prev => {
      const currentMsgReactions = prev[messageId] || { heart: false, haha: false };
      return {
        ...prev,
        [messageId]: { ...currentMsgReactions, [reactionType]: !hasReacted }
      };
    });

    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || { heart: 0, haha: 0 };
          const currentCount = currentReactions[reactionType] || 0;
          return {
            ...msg,
            reactions: {
              ...currentReactions,
              [reactionType]: hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1
            }
          };
        }
        return msg;
      })
    );

    try {
      const messageDocRef = doc(db, 'messages', messageId);
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(messageDocRef);
        if (!sfDoc.exists()) return;

        const data = sfDoc.data();
        const currentReactions = data.reactions || { heart: 0, haha: 0 };
        const currentCount = currentReactions[reactionType] || 0;
        let newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

        transaction.update(messageDocRef, {
          reactions: {
            ...currentReactions,
            [reactionType]: newCount
          }
        });
      });
    } catch (error) {
      console.error("Failed to update reaction counter: ", error);
    }
  };

  // --- ADD COMMENT ---
  const handleSubmitComment = async (e, messageId) => {
    e.preventDefault();
    if (!commentInput.trim() || !globalAuthor) return;

    const tempCommentText = commentInput.trim();
    setCommentInput(''); 

    const newCommentObj = {
      author: globalAuthor,
      text: tempCommentText,
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingComments = msg.comments || [];
          return { ...msg, comments: [...existingComments, newCommentObj] };
        }
        return msg;
      })
    );

    try {
      const messageDocRef = doc(db, 'messages', messageId);
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(messageDocRef);
        if (!sfDoc.exists()) return;

        const data = sfDoc.data();
        const currentComments = data.comments || [];

        transaction.update(messageDocRef, {
          comments: [...currentComments, newCommentObj]
        });
      });
    } catch (error) {
      console.error("Error saving comment to DB: ", error);
    }
  };

  // --- DELETE COMMENT ---
  const handleDeleteComment = async (messageId, commentIndex) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const filteredComments = (msg.comments || []).filter((_, idx) => idx !== commentIndex);
          return { ...msg, comments: filteredComments };
        }
        return msg;
      })
    );

    try {
      const messageDocRef = doc(db, 'messages', messageId);
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(messageDocRef);
        if (!sfDoc.exists()) return;

        const data = sfDoc.data();
        const currentComments = data.comments || [];
        const updatedComments = currentComments.filter((_, idx) => idx !== commentIndex);

        transaction.update(messageDocRef, { comments: updatedComments });
      });
    } catch (error) {
      console.error("Error deleting comment in backend: ", error);
    }
  };

  // --- START EDIT COMMENT CONFIG ---
  const startEditingComment = (index, currentText) => {
    setEditingCommentIndex(index);
    setEditingCommentText(currentText);
  };

  // --- SAVE EDITED COMMENT (REMOVED SIGNATURE EDITED FLAG PER INSTRUCTION) ---
  const handleSaveEditedComment = async (messageId, commentIndex) => {
    if (!editingCommentText.trim()) return;

    const textToSave = editingCommentText.trim();
    setEditingCommentIndex(null); 

    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const updatedComments = (msg.comments || []).map((cmt, idx) => {
            if (idx === commentIndex) {
              return { ...cmt, text: textToSave };
            }
            return cmt;
          });
          return { ...msg, comments: updatedComments };
        }
        return msg;
      })
    );

    try {
      const messageDocRef = doc(db, 'messages', messageId);
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(messageDocRef);
        if (!sfDoc.exists()) return;

        const data = sfDoc.data();
        const currentComments = data.comments || [];
        const updatedComments = currentComments.map((cmt, idx) => {
          if (idx === commentIndex) {
            return { ...cmt, text: textToSave };
          }
          return cmt;
        });

        transaction.update(messageDocRef, { comments: updatedComments });
      });
    } catch (error) {
      console.error("Error saving edited comment in backend: ", error);
    }
  };

  const requestDeleteMessage = (e, id) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const confirmDeleteMessage = async () => {
    if (deleteTargetId) {
      try {
        await deleteDoc(doc(db, 'messages', deleteTargetId));
        setMyPostIds(prev => prev.filter(id => id !== deleteTargetId));
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Error deleting document from Firestore: ", error);
      }
    }
  };

  const marqueeImages = [
    image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
    image11, image12, image13, image14, image15, image16, image17, image18, image19, image20,
    image21, image22, image23, image24, image25, image26, image27, image28, image29, image30,
    image31
  ]

  const collageImages = [
    image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
    image11, image12, image13, image14, image15, image16, image17, image18, image19, image20,
    image21, image22, image23, image24, image25, image26, image27, image28, image29, image30,
    image31
  ]

  const collageVideos = [video1, video2, video3, video4, video5]

  // --- DYNAMIC PAUSABLE MARQUEE WITH MANUAL GESTURE TRACKING ---
  const useHybridSlider = () => {
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => {
      setIsDragging(true);
      startX.current = e.pageX - trackRef.current.offsetLeft;
      scrollLeft.current = trackRef.current.scrollLeft;
    };

    const onMouseMove = (e) => {
      if (!startX.current || !isDragging) return;
      e.preventDefault();
      const x = e.pageX - trackRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.5; 
      trackRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const stopDragging = () => {
      setIsDragging(false);
    };

    const onTouchStart = (e) => {
      setIsDragging(true);
      startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
      scrollLeft.current = trackRef.current.scrollLeft;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - trackRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      trackRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return {
      ref: trackRef,
      onMouseDown,
      onMouseMove,
      onMouseUp: stopDragging,
      onMouseLeave: stopDragging,
      onTouchStart,
      onTouchMove,
      onTouchEnd: stopDragging,
      // Kung naka drag, hihinto ang CSS transformation marquee loop
      className: `flex gap-5 md:gap-8 overflow-x-auto select-none no-scrollbar cursor-grab active:cursor-grabbing ${isDragging ? 'pause-marquee' : ''}`
    };
  };

  const graduatesSlider = useHybridSlider();
  const photoSlider = useHybridSlider();
  const videoSlider = useHybridSlider();
  const lettersSlider = useHybridSlider();

  const handleArrowNav = (sliderRef, direction) => {
    const shift = window.innerWidth < 768 ? 290 : 360;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += direction === 'left' ? -shift : shift;
    }
  };

  const activeSelectedMessageData = selectedMessage ? messages.find(m => m.id === selectedMessage.id) : null;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#191919] font-sans antialiased selection:bg-[#f1ece4] overflow-x-hidden">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scroll-width: none; }

        /* Smooth Marquee Animations */
        @keyframes customMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes customMarqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-loop-left { display: flex; width: max-content; animation: customMarquee 120s linear infinite; }
        .animate-loop-right { display: flex; width: max-content; animation: customMarqueeReverse 120s linear infinite; }
        
        /* Instant Pause rules kapag hinawakan o hinover */
        .pause-marquee .animate-loop-left,
        .pause-marquee .animate-loop-right,
        .animate-loop-left:hover,
        .animate-loop-right:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* --- INITIAL NAME POP-UP MODAL --- */}
      {!globalAuthor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#fbfaf7]/80 backdrop-blur-xl">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-[#decbba] shadow-[0_32px_64px_-16px_rgba(40,35,30,0.12)] text-center">
            <span className="text-4xl block mb-4">✨</span>
            <h3 className="font-serif text-2xl font-normal text-[#1a1a1a] mb-2">Welcome, Graduate!</h3>
            <p className="text-xs text-[#66635e] leading-relaxed mb-6">Please enter your name to unlock the Batch 2026 gallery and memory archive system.</p>
            <form onSubmit={handleSaveName} className="space-y-4">
              <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Enter your full name..." required className="w-full bg-[#fbfaf7] border border-[#decbba] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5c4e3c] text-center font-medium" />
              <button type="submit" className="w-full bg-[#5c4e3c] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#473b2c] shadow-sm uppercase tracking-wider transition-colors">Explore Archive</button>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-[#decbba] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100"><AlertTriangle size={24} /></div>
            <h3 className="font-serif text-xl font-normal text-[#1a1a1a] mb-2">Delete Message?</h3>
            <p className="text-xs text-[#66635e] leading-relaxed mb-6">Are you sure you want to permanently remove this reflection? This action cannot be undone.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeleteTargetId(null)} className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-100 border border-gray-200/60 transition-colors">Cancel</button>
              <button onClick={confirmDeleteMessage} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-red-600 shadow-sm transition-colors">Delete Post</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MESSAGE & COMMENTS POP-UP MODAL --- */}
      {selectedMessage !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md" onClick={() => { setSelectedMessage(null); setEditingCommentIndex(null); }}>
          <div className="bg-[#fdfdfc] max-w-xl w-full rounded-2xl p-6 md:p-8 border border-[#decbba] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.16)] relative flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setSelectedMessage(null); setEditingCommentIndex(null); }} className="absolute top-5 right-5 text-[#8c7e6b] hover:text-[#1a1a1a] p-1.5 rounded-full hover:bg-[#f4f0e8] transition-all duration-200">
              <X size={18} />
            </button>
            
            <div className="overflow-y-auto pr-1 flex-1 space-y-5 custom-scrollbar">
              <div className="mt-2">
                <h3 className="font-serif text-xl md:text-2xl font-normal text-[#1a1a1a] mb-3 pr-6 leading-tight">{selectedMessage.title}</h3>
                <div className="w-10 h-[2px] bg-[#5c4e3c] mb-4" />
                <p className="text-[#3b3935] text-sm md:text-base leading-relaxed font-light text-justify whitespace-pre-wrap">{selectedMessage.body}</p>
                <div className="mt-3 text-right">
                  <span className="font-serif italic text-sm text-[#8c7e6b]">— {selectedMessage.author}</span>
                </div>
              </div>

              {/* Reaction Section */}
              <div className="flex gap-2.5 items-center pt-3 border-t border-[#f4f0e8]">
                <button 
                  onClick={(e) => handleToggleReaction(e, selectedMessage.id, 'heart')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ease-out border select-none ${myReactions[selectedMessage.id]?.heart ? 'bg-red-50 text-red-600 border-red-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#decbba] text-[#66635e] hover:bg-gray-50 active:scale-95'}`}
                >
                  <span>❤️</span> <span>{activeSelectedMessageData?.reactions?.heart || 0}</span>
                </button>
                <button 
                  onClick={(e) => handleToggleReaction(e, selectedMessage.id, 'haha')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ease-out border select-none ${myReactions[selectedMessage.id]?.haha ? 'bg-amber-50 text-amber-600 border-amber-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#decbba] text-[#66635e] hover:bg-gray-50 active:scale-95'}`}
                >
                  <span>😂</span> <span>{activeSelectedMessageData?.reactions?.haha || 0}</span>
                </button>
              </div>

              {/* Comment Section List */}
              <div className="pt-4 border-t border-[#f4f0e8]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#787266] mb-3 flex items-center gap-1.5">
                  <MessageSquare size={13} /> Comments ({activeSelectedMessageData?.comments?.length || 0})
                </h4>
                
                <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                  {activeSelectedMessageData?.comments && activeSelectedMessageData.comments.length > 0 ? (
                    activeSelectedMessageData.comments.map((cmt, cIdx) => (
                      <div key={`modal-cmt-${cIdx}`} className="bg-[#fbfaf7] border border-[#e8e2d5]/80 rounded-xl p-3 text-left relative group/cmt">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#5c4e3c]">{cmt.author}</span>
                          <span className="text-[9px] font-mono text-[#a39a8c]">
                            {cmt.timestamp ? new Date(cmt.timestamp).toLocaleDateString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Just now'}
                          </span>
                        </div>
                        
                        {editingCommentIndex === cIdx ? (
                          <div className="flex gap-2 mt-2 items-center">
                            <input 
                              type="text" 
                              value={editingCommentText} 
                              onChange={(e) => setEditingCommentText(e.target.value)} 
                              maxLength={300}
                              className="flex-1 bg-white border border-[#decbba] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#5c4e3c]"
                            />
                            <button 
                              onClick={() => handleSaveEditedComment(selectedMessage.id, cIdx)} 
                              className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              <Check size={12} />
                            </button>
                            <button 
                              onClick={() => setEditingCommentIndex(null)} 
                              className="bg-gray-100 text-gray-500 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-[#4a4742] text-xs font-light leading-relaxed whitespace-pre-wrap pr-12">{cmt.text}</p>
                            
                            {cmt.author === globalAuthor && (
                              <div className="absolute right-2.5 bottom-2 flex items-center gap-1 opacity-0 group-hover/cmt:opacity-100 transition-opacity duration-200">
                                <button 
                                  onClick={() => startEditingComment(cIdx, cmt.text)}
                                  className="text-[#8c7e6b] hover:text-[#5c4e3c] p-1 rounded-md hover:bg-[#f4f0e8] transition-colors"
                                  title="Edit comment"
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteComment(selectedMessage.id, cIdx)}
                                  className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                  title="Delete comment"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 bg-[#fbfaf7] rounded-xl border border-dashed border-[#decbba] text-xs font-serif italic text-[#8c7e6b]">
                      No conversations yet. Be the first to drop a comment!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={(e) => handleSubmitComment(e, selectedMessage.id)} className="mt-4 pt-3 border-t border-[#f4f0e8] flex gap-2 items-center">
              <input 
                type="text" 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a supportive reply..." 
                maxLength={300}
                required
                className="flex-1 bg-[#fbfaf7] border border-[#decbba] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#5c4e3c]"
              />
              <button type="submit" className="bg-[#5c4e3c] text-white p-2.5 rounded-xl hover:bg-[#473b2c] transition-colors shadow-sm flex items-center justify-center flex-shrink-0">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="max-w-5xl mx-auto text-center pt-28 md:pt-36 pb-16 md:pb-20 px-6">
        <div className="flex flex-col relative items-center justify-center gap-2 mb-4">
          <div className="text-5xl absolute -top-8 md:text-7xl">🎓</div>
          <h1 className="font-serif text-5xl md:text-8xl font-normal tracking-tight text-[#1a1a1a] leading-none">Batch 2026</h1>
        </div>
        <p className="text-[#66635e] font-serif italic text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">A widescreen, living archive of our shared, unforgettable journey.</p>
        {globalAuthor && (
          <div className="mt-4 text-xs font-mono text-[#8c7e6b] uppercase tracking-wider">
            Logged in as: <span className="font-semibold text-[#5c4e3c] normal-case font-sans">{globalAuthor}</span>
          </div>
        )}
      </header>

      {/* --- OFFICIAL VIDEO COMPILATION FLAG --- */}
      <section className="w-full relative mb-24 md:mb-32 py-10 md:py-16 bg-[#f5f1e9]/40 border-y border-[#e8e2d5]/60 overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-0 opacity-10 filter grayscale flex gap-6 w-max">
          {marqueeImages.slice(0, 8).map((src, idx) => (
            <img key={`backdrop-img-${idx}`} src={src} alt="Memory backdrop" className="w-52 h-36 md:w-72 md:h-48 object-cover rounded-xl border border-[#dcd5c9]" />
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
          <div className="relative min-h-[340px] md:aspect-video w-full rounded-2xl md:rounded-3xl bg-[#fdfdfc]/90 backdrop-blur-xl border border-[#decbba] shadow-[0_24px_48px_-12px_rgba(40,35,30,0.06)] flex items-center justify-center overflow-hidden group hover:border-[#bfae99] transition-all duration-500">
            <div className="text-center p-6 py-12 md:py-16 px-4 md:px-16 flex flex-col items-center w-full relative z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-widest uppercase bg-[#5c4e3c] text-[#fbfaf7] mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                </span>
                Coming Soon
              </div>
              <div className="mb-6 relative flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#5c4e3c] text-[#fbfaf7] flex items-center justify-center shadow-lg border border-[#fbfaf7]/10 group-hover:scale-110 group-hover:bg-[#473b2c] transition-all duration-300 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 ml-1 text-[#fbfaf7]"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <h3 className="font-serif text-2xl md:text-4xl font-normal mb-4 text-[#1a1a1a] tracking-tight">Film by Christian</h3>
              <p className="text-[#524f4a] text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light text-center px-2 mb-6">I am currently fine tuning and editing this video compilation for all of us. It will bring together our untold stories, inside jokes, and unforgettable milestones spanning from <span className="font-semibold text-[#5c4e3c]">1st Year to 4th Year</span>. Stay tuned!</p>
              <div className="text-[10px] md:text-xs tracking-widest uppercase font-mono text-[#787266] max-w-2xl border-t border-[#decbba]/60 pt-4 mt-2">
                <span className="text-[#3b352b] font-serif tracking-normal normal-case italic mr-1">Featuring:</span>Christian • Nico • Jane • Patricia • Zara • Lyn • Analeth • Elmina • Bea • Jinky • Faith • Bealyn
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRADUATES SECTION (ANIMATED + DRAGGABLE) --- */}
      <section className="w-full bg-[#fbfaf7] mb-20 md:mb-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6 w-full">
            <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight text-[#1a1a1a] whitespace-nowrap">Class of 2026</h2>
            <div className="w-full h-[1px] bg-[#e8e2d5]" />
          </div>
        </div>
        <div className="relative w-full px-4 md:px-12">
          <button onClick={() => handleArrowNav(graduatesSlider.ref, 'left')} className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/95 border border-[#e8e2d5] text-[#1a1a1a] shadow-xl hover:bg-[#5c4e3c] hover:text-white transition-all duration-300"><ChevronLeft size={20} /></button>
          <button onClick={() => handleArrowNav(graduatesSlider.ref, 'right')} className="absolute right-6 md:right-14 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/95 border border-[#e8e2d5] text-[#1a1a1a] shadow-xl hover:bg-[#5c4e3c] hover:text-white transition-all duration-300"><ChevronRight size={20} /></button>
          
          <div className="w-full py-4 px-2">
            <div {...graduatesSlider}>
              <div className="animate-loop-left gap-5 md:gap-8">
                {graduates.map((grad, i) => (
                  <div key={`grad-set1-${grad.id}-${i}`} className="w-[270px] md:w-[320px] h-[430px] md:h-[500px] rounded-[2rem] overflow-hidden relative border border-[#e8e2d5] flex-shrink-0 bg-[#f5f1e9] pointer-events-none select-none">
                    <div className="absolute inset-0 w-full h-full"><img src={grad.image} alt={grad.name} className="w-full h-full object-cover object-top filter contrast-[1.01] saturate-[1.02]" draggable="false" /></div>
                    <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/10 p-5 md:p-6 text-left flex flex-col justify-end">
                      <span className="text-[9px] md:text-[10px] font-bold text-[#ebdccb] tracking-widest uppercase mb-1 md:mb-1.5 opacity-90">{grad.course}</span>
                      <h3 className="font-serif text-xl md:text-2xl font-normal text-white mb-2 md:mb-3 tracking-tight leading-tight">{grad.name}</h3>
                      <div className="w-6 h-[1.5px] bg-[#ebdccb]/60 mb-2.5 md:mb-3.5" />
                      <p className="font-serif text-[12px] md:text-[13.5px] text-[#e0deda]/95 italic leading-relaxed line-clamp-3">"{grad.quote}"</p>
                    </div>
                  </div>
                ))}
                {/* Marquee Infinite Clone */}
                {graduates.map((grad, i) => (
                  <div key={`grad-set2-${grad.id}-${i}`} className="w-[270px] md:w-[320px] h-[430px] md:h-[500px] rounded-[2rem] overflow-hidden relative border border-[#e8e2d5] flex-shrink-0 bg-[#f5f1e9] pointer-events-none select-none">
                    <div className="absolute inset-0 w-full h-full"><img src={grad.image} alt={grad.name} className="w-full h-full object-cover object-top filter contrast-[1.01] saturate-[1.02]" draggable="false" /></div>
                    <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/10 p-5 md:p-6 text-left flex flex-col justify-end">
                      <span className="text-[9px] md:text-[10px] font-bold text-[#ebdccb] tracking-widest uppercase mb-1 md:mb-1.5 opacity-90">{grad.course}</span>
                      <h3 className="font-serif text-xl md:text-2xl font-normal text-white mb-2 md:mb-3 tracking-tight leading-tight">{grad.name}</h3>
                      <div className="w-6 h-[1.5px] bg-[#ebdccb]/60 mb-2.5 md:mb-3.5" />
                      <p className="font-serif text-[12px] md:text-[13.5px] text-[#e0deda]/95 italic leading-relaxed line-clamp-3">"{grad.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHOTO COLLAGE (ANIMATED + DRAGGABLE) --- */}
      <section className="w-full overflow-hidden px-4 md:px-12 mb-4">
        <div {...photoSlider}>
          <div className="animate-loop-right gap-4 md:gap-6">
            {collageImages.map((src, idx) => (
              <div key={`photo-c1-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md flex-shrink-0 pointer-events-none select-none">
                <img src={src} alt={`Memory ${idx + 1}`} className="w-full h-64 md:h-80 object-cover rounded-lg mb-3" draggable="false" />
                <div className="h-1.5 md:h-2 w-12 md:w-16 bg-[#ebdccb]/50 rounded-full mx-auto" />
              </div>
            ))}
            {collageImages.map((src, idx) => (
              <div key={`photo-c2-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md flex-shrink-0 pointer-events-none select-none">
                <img src={src} alt={`Memory clone ${idx + 1}`} className="w-full h-64 md:h-80 object-cover rounded-lg mb-3" draggable="false" />
                <div className="h-1.5 md:h-2 w-12 md:w-16 bg-[#ebdccb]/50 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VIDEO COLLAGE (ANIMATED + DRAGGABLE) --- */}
      <section className="w-full bg-[#f4f0e8]/30 pb-12 pt-6 px-4 md:px-12">
        <div {...videoSlider}>
          <div className="animate-loop-left gap-4 md:gap-6">
            {collageVideos.map((src, idx) => (
              <div key={`video-c1-${idx}`} className="relative w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md flex-shrink-0 select-none">
                <video ref={(el) => (videoRefs.current[`v1-${idx}`] = el)} src={src} autoPlay loop muted={activeVideoIndex !== `v1-${idx}`} playsInline className="w-full h-64 md:h-80 object-cover rounded-lg mb-3 bg-[#f5f1e9] pointer-events-none" />
                <button onClick={(e) => { e.stopPropagation(); toggleMute(`v1-${idx}`); }} className="absolute top-4 right-4 bg-black/60 text-white text-xs w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center z-10 cursor-pointer">
                  {activeVideoIndex === `v1-${idx}` ? <Volume2 size={16} /> : <VolumeOff size={16} />}
                </button>
                <div className="h-1.5 md:h-2 w-16 md:w-20 bg-[#ebdccb]/70 rounded-full mx-auto" />
              </div>
            ))}
            {collageVideos.map((src, idx) => (
              <div key={`video-c2-${idx}`} className="relative w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md flex-shrink-0 select-none">
                <video ref={(el) => (videoRefs.current[`v2-${idx}`] = el)} src={src} autoPlay loop muted={activeVideoIndex !== `v2-${idx}`} playsInline className="w-full h-64 md:h-80 object-cover rounded-lg mb-3 bg-[#f5f1e9] pointer-events-none" />
                <button onClick={(e) => { e.stopPropagation(); toggleMute(`v2-${idx}`); }} className="absolute top-4 right-4 bg-black/60 text-white text-xs w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center z-10 cursor-pointer">
                  {activeVideoIndex === `v2-${idx}` ? <Volume2 size={16} /> : <VolumeOff size={16} />}
                </button>
                <div className="h-1.5 md:h-2 w-16 md:w-20 bg-[#ebdccb]/70 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LETTERS & REFLECTIONS SECTION (ANIMATED + DRAGGABLE) --- */}
      <section className="max-w-5xl mx-auto px-6 mb-24 md:mb-32 mt-16">
        <div className="flex items-center gap-6 mb-12 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight text-[#1a1a1a] whitespace-nowrap">Letters & Reflections</h2>
          <div className="w-full h-[1px] bg-[#e8e2d5]" />
        </div>

        <div className="relative w-full px-4 mb-14">
          <button onClick={() => handleArrowNav(lettersSlider.ref, 'left')} className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 border border-[#e8e2d5] text-[#1a1a1a] shadow-xl hover:bg-[#5c4e3c] hover:text-white transition-all duration-300"><ChevronLeft size={18} /></button>
          <button onClick={() => handleArrowNav(lettersSlider.ref, 'right')} className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 border border-[#e8e2d5] text-[#1a1a1a] shadow-xl hover:bg-[#5c4e3c] hover:text-white transition-all duration-300"><ChevronRight size={18} /></button>

          <div className="w-full py-4">
            <div {...lettersSlider}>
              <div className="animate-loop-left gap-6 py-2">
                {messages.length > 0 ? (
                  <>
                    {messages.map((msg, index) => (
                      <div 
                        key={`msg-card-s1-${msg.id}-${index}`} 
                        onClick={() => setSelectedMessage(msg)}
                        className="w-[290px] md:w-[380px] bg-[#fdfdfc] border border-[#e8e2d5] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:border-[#ccbfad] cursor-pointer hover:shadow-md transition-all duration-300 relative flex-shrink-0 select-none"
                      >
                        {myPostIds.includes(msg.id) && (
                          <button onClick={(e) => requestDeleteMessage(e, msg.id)} className="absolute top-5 right-5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all duration-200 border border-red-100 z-10">
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div>
                          <h3 className="font-serif text-lg font-normal text-[#1a1a1a] mt-2 mb-2 line-clamp-1">{msg.title}</h3>
                          <p className="text-[#524f4a] text-xs leading-relaxed font-light text-justify line-clamp-3 h-[54px] overflow-hidden">{msg.body}</p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-[#f4f0e8] flex items-center justify-between">
                          <div className="flex gap-1.5 relative z-20">
                            <button 
                              onClick={(e) => handleToggleReaction(e, msg.id, 'heart')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 ease-out border select-none ${myReactions[msg.id]?.heart ? 'bg-red-50 text-red-600 border-red-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#e8e2d5] text-[#787266] hover:bg-gray-50 active:scale-95'}`}
                            >
                              <span>❤️</span> <span>{msg.reactions?.heart || 0}</span>
                            </button>
                            <button 
                              onClick={(e) => handleToggleReaction(e, msg.id, 'haha')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 ease-out border select-none ${myReactions[msg.id]?.haha ? 'bg-amber-50 text-amber-600 border-amber-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#e8e2d5] text-[#787266] hover:bg-gray-50 active:scale-95'}`}
                            >
                              <span>😂</span> <span>{msg.reactions?.haha || 0}</span>
                            </button>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-gray-50 border border-gray-200/70 text-[#787266]">
                              <MessageSquare size={10} className="text-[#8c7e6b]" />
                              <span>{msg.comments?.length || 0}</span>
                            </div>
                          </div>
                          <span className="font-serif italic text-xs text-[#8c7e6b] truncate pl-2 max-w-[110px]">— {msg.author}</span>
                        </div>
                      </div>
                    ))}
                    {/* Marquee Infinite Loop Clone for Messages */}
                    {messages.map((msg, index) => (
                      <div 
                        key={`msg-card-s2-${msg.id}-${index}`} 
                        onClick={() => setSelectedMessage(msg)}
                        className="w-[290px] md:w-[380px] bg-[#fdfdfc] border border-[#e8e2d5] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:border-[#ccbfad] cursor-pointer hover:shadow-md transition-all duration-300 relative flex-shrink-0 select-none"
                      >
                        {myPostIds.includes(msg.id) && (
                          <button onClick={(e) => requestDeleteMessage(e, msg.id)} className="absolute top-5 right-5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all duration-200 border border-red-100 z-10">
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div>
                          <h3 className="font-serif text-lg font-normal text-[#1a1a1a] mt-2 mb-2 line-clamp-1">{msg.title}</h3>
                          <p className="text-[#524f4a] text-xs leading-relaxed font-light text-justify line-clamp-3 h-[54px] overflow-hidden">{msg.body}</p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-[#f4f0e8] flex items-center justify-between">
                          <div className="flex gap-1.5 relative z-20">
                            <button 
                              onClick={(e) => handleToggleReaction(e, msg.id, 'heart')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 ease-out border select-none ${myReactions[msg.id]?.heart ? 'bg-red-50 text-red-600 border-red-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#e8e2d5] text-[#787266] hover:bg-gray-50 active:scale-95'}`}
                            >
                              <span>❤️</span> <span>{msg.reactions?.heart || 0}</span>
                            </button>
                            <button 
                              onClick={(e) => handleToggleReaction(e, msg.id, 'haha')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 ease-out border select-none ${myReactions[msg.id]?.haha ? 'bg-amber-50 text-amber-600 border-amber-200 font-medium scale-105 shadow-sm' : 'bg-[#fbfaf7] border-[#e8e2d5] text-[#787266] hover:bg-gray-50 active:scale-95'}`}
                            >
                              <span>😂</span> <span>{msg.reactions?.haha || 0}</span>
                            </button>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-gray-50 border border-gray-200/70 text-[#787266]">
                              <MessageSquare size={10} className="text-[#8c7e6b]" />
                              <span>{msg.comments?.length || 0}</span>
                            </div>
                          </div>
                          <span className="font-serif italic text-xs text-[#8c7e6b] truncate pl-2 max-w-[110px]">— {msg.author}</span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center w-full text-xs text-[#8c7e6b] font-serif italic py-6">Loading shared reflections...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- FORM SUBMISSION BOX --- */}
        <div className="max-w-xl mx-auto bg-[#fdfdfc] border border-[#e8e2d5] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <h3 className="font-serif text-xl font-normal text-[#1a1a1a] mb-2">Leave a Message</h3>
          <p className="text-xs text-[#787266] mb-6 leading-relaxed">Posting as <span className="font-semibold text-[#5c4e3c] font-sans">{globalAuthor}</span>. Share your favorite memories directly to the board.</p>
          
          <form onSubmit={handleSubmitMessage} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c7e6b] mb-1.5">Message Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., To my favorite coders" required disabled={isSubmitting} className="w-full bg-[#fbfaf7] border border-[#decbba] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5c4e3c] disabled:opacity-60" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c7e6b] mb-1.5">Message</label>
              <textarea name="body" value={formData.body} onChange={handleInputChange} rows="4" placeholder="Write your beautiful memory here..." required disabled={isSubmitting} className="w-full bg-[#fbfaf7] border border-[#decbba] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5c4e3c] resize-none disabled:opacity-60" />
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#5c4e3c] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#473b2c] shadow-sm transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 disabled:bg-[#8c7e6b]">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Posting Reflection...</span>
                </>
              ) : (<span>Post Message</span>)}
            </button>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 border-t border-[#e8e2d5] text-center text-[11px] text-[#8c7e6b] tracking-wider uppercase font-mono">
        © 2026 Myrtle Christian School Inc. • Frontend System Archive
      </footer>

    </div>
  );
}

export default App;