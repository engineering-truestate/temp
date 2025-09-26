import React, { useState, useEffect } from 'react';
import report from '/assets/icons/features/report.svg';
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { setShowSignInModal } from "../slices/modalSlice";
import closeicon from '/assets/icons/navigation/btn-close.svg';
import {db, auth} from '../firebase';
import { collection, query, where, getDocs, updateDoc, addDoc, doc } from 'firebase/firestore';
import { runTransaction } from 'firebase/firestore';
import { useSelector } from "react-redux";
import { COUNTRY_CODES_OPTIONS } from '../constants/countryCodes';
import { countryCodeDropdownStyle } from '../utils/countryCodeDropdownStyle';
import { useModalConfig } from '../contexts/ModalConfigContext';

// UTM Tracking Hook
function useTrackUTMParams() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
      term: params.get("utm_term"),
      content: params.get("utm_content"),
    };
    console.log(utmParams);

    const hasUTM = Object.values(utmParams).some((v) => v !== null);
    if (hasUTM) {
      // Store UTM params in localStorage for later use
      localStorage.setItem("utm_params", JSON.stringify(utmParams));
    }
  }, []);
}

function NewLaunches() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    countryCode: '+91'
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const { modalConfig, defaultFlag } = useModalConfig();
  const flag = modalConfig?.flag ?? defaultFlag;
  console.log("my fetched data is",modalConfig)
  console.log("my flag is",flag)
  let myinterest = "BDA_Sept";
  if(flag === "launches"){
    myinterest = "Comparison North Bangalore";
  }
  // You can also destructure individually if needed
  

  // Initialize UTM tracking
  useTrackUTMParams();
  // Google Apps Script Web App URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1UdpKn5PadSPXkocrLrice7LC5hOGwukWmu3eueHWpflyEOlNNoI18pydvtcKWde4WA/exec';

  // Function to get UTM details
 const getUTMDetails = () => {
  try {
    const storedUtmParams = localStorage.getItem("utm_params");
    if (storedUtmParams) {
      const utmParams = JSON.parse(storedUtmParams);
      // Filter out null/empty values and return as object
      const cleanedUtmParams = Object.entries(utmParams)
        .filter(([key, value]) => value !== null && value !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      
      return Object.keys(cleanedUtmParams).length > 0 ? cleanedUtmParams : null;
    }
  } catch (error) {
    console.error('Error parsing UTM params:', error);
  }
  return null;
};

  // Show download modal when component loads
  useEffect(() => {
    setShowDownloadModal(true);
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Phone number validation (basic validation for different country codes)
    // Enhanced phone number validation
if (!formData.phoneNumber.trim()) {
  newErrors.phoneNumber = 'Phone number is required';
} else if (!/^\d+$/.test(formData.phoneNumber)) {
  newErrors.phoneNumber = 'Phone number must contain only digits';
} else if (formData.phoneNumber.trim().length < 6) {
  newErrors.phoneNumber = 'Phone number must be at least 6 digits';
} else if (formData.phoneNumber.trim().length > 15) {
  newErrors.phoneNumber = 'Phone number cannot exceed 15 digits';
}
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePhoneNumberChange = (e) => {
  const { value } = e.target;
  // Remove any non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  setFormData(prev => ({
    ...prev,
    phoneNumber: numericValue
  }));
  
  // Clear error when user starts typing
  if (errors.phoneNumber) {
    setErrors(prev => ({
      ...prev,
      phoneNumber: ''
    }));
  }
};
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle country code change
  const handleCountryCodeChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      countryCode: selectedOption.value
    }));
  };

  // Get the selected country code option for the Select component
  const getSelectedCountryCode = () => {
    return COUNTRY_CODES_OPTIONS.find(option => option.value === formData.countryCode) || COUNTRY_CODES_OPTIONS[0];
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowDownloadModal(false);
    navigate('/'); // Navigate to home or another page

    // Optionally navigate somewhere or perform other actions
    // navigate('/some-route');
  };

  // Save data to Google Sheets via Apps Script
  const saveToGoogleSheets = async (userData) => {
    try {
      // Get UTM details
      const utmDetails = getUTMDetails();
      
      // Method 1: JSONP approach (bypasses CORS)
      const saveWithJSONP = () => {
        return new Promise((resolve, reject) => {
          const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
          
          // Create script element
          const script = document.createElement('script');
          
          // Build URL with parameters including UTM details
          const params = new URLSearchParams({
            action: 'save',
            name: userData.name,
            phoneNumber: userData.phoneNumber,
            countryCode: userData.countryCode,
            phoneWithCode: `${userData.countryCode} ${userData.phoneNumber}`,
            source: 'Investment Report Form',
            utmDetails: utmDetails,
            callback: callbackName
          });
          
          script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
          
          // Set up callback
          window[callbackName] = (data) => {
            // Clean up
            document.head.removeChild(script);
            delete window[callbackName];
            
            if (data.status === 'success') {
              resolve(true);
            } else {
              console.error('JSONP Error:', data.message);
              resolve(false);
            }
          };
          
          // Handle script load error
          script.onerror = () => {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('Script loading failed'));
          };
          
          // Add script to head
          document.head.appendChild(script);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            if (window[callbackName]) {
              document.head.removeChild(script);
              delete window[callbackName];
              reject(new Error('Request timeout'));
            }
          }, 10000);
        });
      };

      // Method 2: GET request with URL parameters (fallback)
      const saveWithGET = async () => {
        const params = new URLSearchParams({
          action: 'save',
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          countryCode: userData.countryCode,
          phoneWithCode: `${userData.countryCode} ${userData.phoneNumber}`,
          source: 'Investment Report Form',
          utmDetails: utmDetails
        });

        const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors'
        });

        return true;
      };

      console.log('Sending data to Apps Script:', { ...userData, utmDetails });

      try {
        // Try JSONP first (this should work)
        const success = await saveWithJSONP();
        if (success) {
          console.log('Data saved successfully via JSONP');
          return true;
        }
      } catch (jsonpError) {
        console.log('JSONP method failed, trying GET fallback:', jsonpError);
        
        try {
          // Fallback to GET request
          await saveWithGET();
          console.log('Data sent via GET request (no-cors)');
          return true;
        } catch (getError) {
          console.error('GET method also failed:', getError);
          return false;
        }
      }

    } catch (error) {
      console.error('Network error calling Apps Script:', error);
      return false;
    }
  };
  const saveDataFallback = async (userData) => {
    try {
      console.log('Using fallback method to save:', userData);
      
      const utmDetails = getUTMDetails();
      
      const dataWithTimestamp = {
        ...userData,
        timestamp: new Date().toLocaleString('en-IN'),
        phoneNumberWithCode: `${userData.countryCode} ${userData.phoneNumber}`,
        source: 'Investment Report Form',
        utmDetails: utmDetails
      };
      
      console.log('Fallback - User data logged:', dataWithTimestamp);
      return true;
    } catch (error) {
      console.error('Fallback method error:', error);
      return false;
    }
  };

 const startDownload = () => {
    try {
      const localFileUrl = '/documents/Investment_Report_2025.pdf';
      
      const link = document.createElement('a');
      link.href = localFileUrl;
      link.download = 'Investment_Report_2025.pdf';
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated for:', localFileUrl);
    } catch (error) {
      console.error('Error starting download:', error);
      window.open('/documents/Investment_Report_2025.pdf', '_blank');
    }
  };
const saveToTruestateUsers = async (userData) => {
  try {
    const { name, phoneNumber, countryCode } = userData;
    
    // Validate required fields
    if (!name || !phoneNumber || !countryCode) {
      console.error('Missing required fields:', { name, phoneNumber, countryCode });
      return { success: false, error: 'Missing required fields: name, phoneNumber, or countryCode' };
    }
    
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    console.log("Phone number is", fullPhoneNumber);
    console.log("Name being saved/updated:", name);
    
    // Get UTM details as JSON object
    const utmDetails = getUTMDetails();
    
    // Determine source from UTM details
    const getSourceFromUTM = (utmDetails) => {
      if (!utmDetails) return "website";
      
      // Priority order: source -> medium -> campaign -> default to "website"
      return utmDetails.source || "website";
    };
    
    const source = getSourceFromUTM(utmDetails);
    
    // Reference to truestateUsers collection
    const usersCollection = collection(db, 'truEstateUsers');
    
    // Query to check if user exists based on phone number
    const q = query(usersCollection, where('phoneNumber', '==', fullPhoneNumber));
    const querySnapshot = await getDocs(q);
    
    const currentTimestamp = new Date();
    
    if (!querySnapshot.empty) {
      // User exists - update the document
      const userDoc = querySnapshot.docs[0];
      const existingData = userDoc.data();
      
      console.log('Existing user data:', existingData);
      console.log('Updating user with name:', name);
      
      const existingInterests = existingData.interest || [];
      
      const updatedInterests = existingInterests.includes(myinterest) 
        ? existingInterests 
        : [...existingInterests, myinterest];
        
      const userDocRef = doc(db, 'truEstateUsers', userDoc.id);
      const updateData = {
        name: name, // Explicitly update name
        isBDATrue: true,
        lastModified: currentTimestamp,
        interest: updatedInterests,
        agentName: "Amit",
        agentId: "TRUES03",
        source: source,
        subSource: "Truestate"
      };
      if (utmDetails) {
        updateData.utmDetails = utmDetails;
      }
      
      await updateDoc(userDocRef, updateData);
      
      console.log('User updated successfully:', userDoc.id);
      console.log('Updated fields:', updateData);
      return { success: true, action: 'updated', docId: userDoc.id, updatedFields: updateData };
      
    } else {
      // User doesn't exist - create new document with custom ID
      console.log('User not found, creating new user...');
      
      // Get and increment the counter from truestateAdmin collection
      const adminDocRef = doc(db, 'truestateAdmin', 'lastLead');
      
      let newUserId;
      let newDocId;
      
      try {
        await runTransaction(db, async (transaction) => {
          const adminDoc = await transaction.get(adminDocRef);
          
          let currentCount;
          if (adminDoc.exists()) {
            currentCount = adminDoc.data().count || 0;
          } else {
            // If document doesn't exist, start with 0
            currentCount = 0;
          }
          
          // Increment the count
          const newCount = currentCount + 1;
          newUserId = `user${newCount}`;
          newDocId = newUserId; // docId and userId are the same
          
          console.log('Generated new user ID:', newUserId);
          console.log('Current count:', currentCount, '-> New count:', newCount);
          // Update the counter in truestateAdmin
          transaction.set(adminDocRef, { count: newCount }, { merge: true });
          
          // Create new user document with custom ID
          const newUser = {
            name: name,
            phoneNumber: fullPhoneNumber,
            userId: newUserId, // Add userId field
            isBDATrue: true,
            lastModified: currentTimestamp,
            utmDetails: utmDetails, // Store as JSON object (or null)
            interest: myinterest,
            agentName: "amit",
            agentId: "TRUES03",
            source: source, // Use source derived from UTM
            subSource: "Truestate"
          };
          
          console.log('Creating new user with data:', newUser);
          
          // Create document with custom ID
          const newUserDocRef = doc(db, 'truEstateUsers', newDocId);
          transaction.set(newUserDocRef, newUser);
        });
        
        console.log('New user created successfully with ID:', newDocId);
        return { 
          success: true, 
          action: 'created', 
          docId: newDocId,
          userId: newUserId,
          userData: {
            name: name,
            phoneNumber: fullPhoneNumber,
            userId: newUserId,
            isBDATrue: true,
            createdAt: currentTimestamp,
            lastModified: currentTimestamp,
            utmDetails: utmDetails, // Store as JSON object
          }
        };
        
      } catch (transactionError) {
        console.error('Transaction failed:', transactionError);
        throw new Error(`Failed to create user with custom ID: ${transactionError.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error saving to truestateUsers:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Save directly to Firestore truestateUsers collection
    const saveResult = await saveToTruestateUsers(formData);
    
    if (saveResult.success) {
      console.log(`User ${saveResult.action} successfully with ID: ${saveResult.docId}`);
      
      // Close the modal
      setShowDownloadModal(false);
      if (isAuthenticated && myinterest=="BDA_Sept") {
        navigate('/auction/bda-auction');
        return;
      }
      // Navigate to the desired page
      setShowSuccessModal(true);
      startDownload();
      // navigate('/auction/bda-auction');
      
    } else {
      alert('Error saving data. Please try again or contact support.');
      console.error('Save error:', saveResult.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  const handleSignUp = () => {
    setShowSuccessModal(false);
    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: "/properties" }));
  };

  return (
    <div className="bg-black min-h-screen w-full relative">
      {/* Add the keyframes animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Background Image - Responsive */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-[20%]">
        {/* // 4 8 20 */}
        <img 
          src={report} 
          alt="New Launches" 
          className="w-full h-screen object-cover blur-sm" 
        />
      </div>

      {/* Download Modal - Responsive */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 relative">
            {/* Close Button - Properly positioned */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
              aria-label="Close modal"
            >
              <img 
                src={closeicon} 
                alt="Close" 
                className="w-5 h-5" 
              />
            </button>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center font-[Montserrat] pr-8">
               {flag === "launches" 
                 ? "Download this Investment Report" 
                 : "Explore BDA Auction"
               }
            </h2>
            
            
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Please Enter"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none text-sm sm:text-base ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Number Field - Responsive */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number*
                </label>
                <div className="flex gap-2">
                  <div className="w-[70px] sm:w-[80px] md:w-[90px]">
                    <Select
                      styles={countryCodeDropdownStyle}
                      options={COUNTRY_CODES_OPTIONS}
                      value={getSelectedCountryCode()}
                      onChange={handleCountryCodeChange}
                      isSearchable={false}
                    />
                  </div>
                  <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                 onChange={handlePhoneNumberChange}
                 onKeyPress={(e) => {
    // Prevent non-numeric characters from being typed
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                e.preventDefault();
              }
             }}
             placeholder="Enter phone number"
             maxLength="15"
             className={`flex-1 px-3 py-1.6 border rounded-md focus:outline-none text-sm sm:text-base ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
           />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Submit Button with inline loader */}
              <button
                type="submit"
                
                disabled={isSubmitting}
                className="w-full bg-[#153E3B] text-white py-3 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base font-medium font-[Lato] transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div 
                      className="mr-2"
                      style={{
                        border: '1.5px solid #f3f3f3',
                        borderTop: '1.5px solid #153E3B',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                        verticalAlign: 'middle'
                      }}
                    ></div>
                    Processing...
                  </>
                ) : (
                  
                  <>
                    {flag === "launches" 
                      ? "Download Report" 
                      : "View BDA Auction"
                    }
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal - Responsive */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 text-center relative">
            {/* Close Button for Success Modal */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
              aria-label="Close modal"
            >
              <img 
                onClick={() => navigate('/')}
                src={closeicon} 
                alt="Close" 
                className="w-5 h-5" 
              />
            </button>

            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 mb-4 sm:mb-6">
              <div className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 text-xl sm:text-2xl flex items-center justify-center font-bold">
                ✓
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold font-[Montserrat] text-gray-800 mb-2">
              {flag === "launches" 
                 ? "Your report download has started" 
                 : "You haven't signed up yet?"
               }
            </h2>
            
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {flag === "launches" 
                 ? "We have over 200 properties for you to explore" 
                 : "Sign up to view BDA"
               }
            </p>
            
            <button
              onClick={handleSignUp}
              className="w-full bg-[#153E3B] text-white py-3 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm sm:text-base font-medium font-[Lato] transition-colors duration-200"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default NewLaunches;