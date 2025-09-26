import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import styles from './Report.module.css';
import { formatCost, formatCostSuffix } from '../../utils/common.js';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase.js';

const CustomSlider = ({ min, max, value, setValue, label, unit = "", markerValue = null , holdingPeriod }) => {


  const [internalValue, setInternalValue] = useState(value);
  const [focusInputState, setFocusInputState] = useState(false);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce the value change to avoid unnecessary re-renders while sliding
  const handleChange = debounce((val) => {
    setValue(val);

    // analytics
    logEvent(analytics, `change_${label}_slider_report`, {
      slider_label: label,
      new_value: val,
    });
  }, 300);

  // Trigger debounced change only when sliding stops
  useEffect(() => {
    handleChange(internalValue);
    return () => handleChange.cancel();
  }, [internalValue]);

  // Calculate the percentage for the filled portion of the slider
  const calculateFillPercentage = () => {
    const percentage = ((internalValue - min) / (max - min)) * 100;
    return percentage;
  };

  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const caretPosition = e.target.selectionStart; // Get current cursor position
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
    const numericValue = parseInt(rawValue, 10);

    // Validate the value before setting
    if (!isNaN(numericValue) && numericValue <= max) {
      setInternalValue(numericValue);
      setTimeout(() => {
        // Restore cursor position
        inputRef.current.setSelectionRange(caretPosition, caretPosition);
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    // Blur the input when Enter is pressed
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const getMarkerPosition = () => {
      if (markerValue != null) {
        if((((markerValue - min) / (max - min)) * 100) < 50)
        setMarkerPosition((((markerValue - min) / (max - min)) + .02) * 100 + '%');
        else
        setMarkerPosition((((markerValue - min) / (max - min))) * 100 + '%');
      }
      else {
        setMarkerPosition(null);
      }
    }

    getMarkerPosition();
  }, [markerValue])

  const handleMarkerClick = () => {
    console.log('clicked', markerValue, value)
    if (markerValue !== null) {
      setInternalValue(markerValue);
    }
  };

  const [isAtMarker, setIsAtMarker] = useState(false);

  useEffect(() => {
    const setThumbColour = () => {
      if(markerValue != null)
      {
        if (value === markerValue)
          setIsAtMarker(true);
        else
          setIsAtMarker(false);
      }
    }
    setThumbColour();
  }, [value, markerValue])

  const formatCost2 = (cost) => {
    if (cost >= 10000000) {
      return `₹${(cost / 10000000).toFixed(2)} Cr`;
    } else if (cost >= 100000) {
      return `₹${(cost / 100000).toFixed(0)} Lacs`;
    } else {
      return `₹${cost}`;
    }
  };

  return (
    <div className="mb-6">
      {/* Label and Input Text Box */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className={`${styles.LeftSideH} font-bold`}>{label}</h3>
        </div>
        <div className='border-[1px] border-[#B5B3B3] w-[120px] min-w-[100px] text-center rounded-[4px] py-1 px-[10px] flex items-center justify-between gap-[6px]'>
          {unit === "Rs" ?
            <>
              {label != "Selling Cost" ?
                <span className='font-lato text-[14px] leading-[21px] text-[#0A0B0A] font-semibold'>
                  {formatCost(internalValue)}
                </span>
                :
                <input
                  ref={inputRef}
                  type="text"
                  className="w-[100px] text-left min-w-[80px] border-none font-lato text-[14px] leading-[21px] text-[#0A0B0A] font-semibold bg-[#FAFAFA]"
                  value={focusInputState ? formatCost(internalValue) : formatCostSuffix(internalValue)}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocusInputState(true)}
                  onBlur={() => setFocusInputState(false)} 
                />
              }
            </>
            :
            <span className='font-lato text-[14px] leading-[21px] text-[#0A0B0A] font-semibold'>
              {internalValue}
            </span>
          }
          {unit != "Rs" &&
            <span className='font-lato text-[14px] leading-[21px] text-center text-[#0A0B0A] font-semibold'>
              {unit}
            </span>
          }
        </div>
      </div>
      <div className='relative'>
        {/* Slider below the label and textbox */}
        <input
          type="range"
          min={min}
          max={max}
          value={internalValue}
          onChange={(e) => setInternalValue(Number(e.target.value))}
          style={{
            '--thumb-color': isAtMarker ? '#EF7717' : '#153E3B',
          }}
          className={styles.customSlider2}
        />
        {/* Clickable marker */}
        {markerPosition && holdingPeriod <= 4 && (
          <div
            onClick={handleMarkerClick}
            style={{
              position: 'absolute',
              left: markerPosition,
              top: '0',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '80%',
              backgroundColor: 'var(--marker-color, #EF7717)',
              cursor: 'crosshair',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomSlider;
