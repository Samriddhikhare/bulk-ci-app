import { useState, useRef, useEffect } from 'react';

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    );
  }
}

export default function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      const idx = TIME_OPTIONS.indexOf(value);
      if (idx >= 0) {
        const item = listRef.current.children[idx];
        if (item) item.scrollIntoView({ block: 'center' });
      }
    }
  }, [open, value]);

  const handleSelect = (t) => {
    onChange(t);
    setOpen(false);
  };

  return (
    <div className="time-picker" ref={wrapperRef}>
      <div className="time-picker-input-wrap">
        <input
          type="text"
          className="field-input time-input"
          value={value}
          placeholder="HH:MM"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
        />
        <span className="time-arrow" onClick={() => setOpen(!open)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 4 6 8 10 4" />
          </svg>
        </span>
      </div>
      {open && (
        <ul className="time-dropdown" ref={listRef}>
          {TIME_OPTIONS.map((t) => (
            <li
              key={t}
              className={`time-option ${t === value ? 'selected' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(t);
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
