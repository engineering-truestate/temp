import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setEditing } from '../../slices/userSlice';
  
export const NavBlocker = () => {
    const isEditing = useSelector((state) => state.user.isEditing);
    const message = "You have unsaved changes. Are you sure you want to leave?";
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [previousPathname, setPreviousPathname] = useState(location.pathname);

    // Handle beforeunload for page refresh or closing the tab
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isEditing) {
                event.preventDefault();
                event.returnValue = message;
            }
        };

        const handleUnloadConfirmed = () => {
            if (isEditing) {
                dispatch(setEditing(false));
                localStorage.removeItem('unsavedProfileData'); // Call your function here if reload is confirmed
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("pagehide", handleUnloadConfirmed);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("pagehide", handleUnloadConfirmed);
        };
    }, [isEditing]);

    const handleConfirmLeave = (nextPath) => {
        setPreviousPathname(nextPath);
        dispatch(setEditing(false));
        localStorage.removeItem('unsavedProfileData');
        window.history.back();
    };

    const handleCancelLeave = () => {
        navigate(previousPathname, { replace: true });
    };    

    // Handle internal navigation blocking
    useEffect(() => {
        if (!isEditing) {
            setPreviousPathname(location.pathname);
            return;
        }

        // if (previousPathname !== location.pathname) {
        //     const confirmLeave = window.confirm(message);
        //     if (!confirmLeave) {
        //         handleCancelLeave();
        //     } else {
        //         handleConfirmLeave(location.pathname);
        //     }
        // }

        // Prevent the default back navigation action by pushing the current state
        history.pushState(null, null, window.location.href);

        const handlePopState = (event) => {
            // const userConfirmed = window.confirm("Are you sure you want to go back?");
            const confirmLeave = window.confirm(message);

            if (confirmLeave) {
                // Allow back navigation
                handleConfirmLeave(location.pathname);

            } else {
                // Block back navigation by pushing the state again
                history.pushState(null, null, window.location.href);
            }
        };

        // Add event listener for popstate
        window.addEventListener('popstate', handlePopState);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, [isEditing, location.pathname, previousPathname, navigate, dispatch]);
}