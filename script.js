/* ============================================
   WORST ALARM CLOCK JS - The JavaScript You Never Asked For
   ============================================ */

// Global state - because global variables are the best practice (not)
let alarms = []; // Array to store all your scheduled suffering
let activeAlarmId = null; // Currently ringing alarm (if any)
let alarmSound = null; // The audio element that will haunt your dreams
let isAlarmRinging = false; // Whether the alarm is currently active
let currentAMPM = 'AM'; // Current AM/PM selection (will flip randomly)
let randomNumberInterval = null; // Interval for random number generation
let ampmChaosInterval = null; // Interval for AM/PM button chaos
let stopButtonChaosInterval = null; // Interval for stop button chaos
let volumeIncreaseInterval = null; // Interval for gradually increasing volume
let thanosGifTimeout = null; // Timeout for hiding Thanos GIF
let screenShakeInterval = null; // Interval for screen shake

// Thanos GIF URL - because memes make everything better
const THANOS_GIF_URL = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW5jeTJscDBoZjBuYWt3ZmV6ZmtwMTNlazRnaTc0ZnFia3Jpcmd5cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ie76dJeem4xBDcf83e/giphy.gif';

// Initialize everything when the page loads - because we're considerate like that
document.addEventListener('DOMContentLoaded', function() {
    console.log('Welcome to your nightmare! The alarm clock is initializing...');
    
    // Create the audio element - using karlsonVibe.mp3 because we're fancy
    alarmSound = new Audio('karlsonVibe.mp3');
    alarmSound.loop = true; // Loop forever because we're evil
    alarmSound.volume = 0.3; // Start at low volume, will increase gradually
    
    // Add error handling for audio loading
    alarmSound.addEventListener('error', function(e) {
        console.error('Audio loading error:', e);
        console.error('Audio error details:', alarmSound.error);
        showMessage('Failed to load alarm sound. Check console for details.', 'error');
    });
    
    alarmSound.addEventListener('canplaythrough', function() {
        console.log('Alarm sound loaded and ready to play');
    });
    
    // Try to load the audio immediately
    alarmSound.load();
    
    // Set up all the event listeners - because buttons need to do things (sometimes)
    setupEventListeners();
    
    // Start random number generator for inputs - make it painful to set time
    startRandomNumberChaos();
    
    // Start AM/PM button chaos - because why not?
    startAMPMChaos();
    
    // Start checking for alarms - the main loop of suffering
    startAlarmChecker();
    
    // Load alarms from localStorage - if you've set any before
    loadAlarmsFromStorage();
    
    // Unlock audio on first user interaction
    unlockAudio();
    
    console.log('Initialization complete. Your doom awaits.');
});

// Unlock audio on first user interaction - browsers require this
let audioUnlocked = false;
function unlockAudio() {
    if (audioUnlocked || !alarmSound) return;
    
    const unlock = function() {
        if (audioUnlocked) return;
        
        // Try to play and immediately pause to unlock audio context
        const playPromise = alarmSound.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                alarmSound.pause();
                alarmSound.currentTime = 0;
                audioUnlocked = true;
                console.log('Audio context unlocked');
            }).catch(function(error) {
                console.error('Failed to unlock audio:', error);
            });
        }
    };
    
    // Unlock on any user interaction
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
}

// Set up all event listeners - organized chaos
function setupEventListeners() {
    // AM Button
    const amBtn = document.getElementById('amBtn');
    if (amBtn) {
        amBtn.addEventListener('click', function() {
            currentAMPM = 'AM';
            updateAMPMButtons();
            showMessage('Niqqa AM set kor', 'info');
        });
    }
    
    // PM Button
    const pmBtn = document.getElementById('pmBtn');
    if (pmBtn) {
        pmBtn.addEventListener('click', function() {
            currentAMPM = 'PM';
            updateAMPMButtons();
            showMessage('Niqqa change it to PM', 'info');
        });
    }
    
    // Set Alarm Button
    const setAlarmBtn = document.getElementById('setAlarmBtn');
    if (setAlarmBtn) {
        setAlarmBtn.addEventListener('click', function() {
            // Sometimes reject the alarm for no reason
            if (Math.random() > 0.85) {
                showMessage('Invalid time! Try again. (Just kidding, it\'s fine.)', 'warning');
                return;
            }
            
            createAlarm();
        });
    }
    
    // Stop Button
    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
        stopBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleStopAlarm();
        });
    }
    
    // Snooze Button
    const snoozeBtn = document.getElementById('snoozeBtn');
    if (snoozeBtn) {
        snoozeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleSnooze();
        });
    }
    
    // Modal close button
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            // Sometimes the close button doesn't work on first click
            if (Math.random() > 0.8) {
                showMessage('Close button clicked. Processing...', 'info');
                setTimeout(function() {
                    hideModal();
                }, 1000);
                return;
            }
            hideModal();
        });
    }
    
    // Click outside modal to close (sometimes)
    const annoyingModal = document.getElementById('annoyingModal');
    if (annoyingModal) {
        annoyingModal.addEventListener('click', function(e) {
            if (e.target === annoyingModal && Math.random() > 0.5) {
                hideModal();
            }
        });
    }
}

// Start random number chaos for inputs - make it painful to set time
function startRandomNumberChaos() {
    randomNumberInterval = setInterval(function() {
        // Only mess with inputs if alarm is not ringing and user is not focused on them
        if (isAlarmRinging) return;
        
        const hourInput = document.getElementById('hourInput');
        const minuteInput = document.getElementById('minuteInput');
        
        // Randomly change values when user is not focused (30% chance)
        if (hourInput && document.activeElement !== hourInput && Math.random() > 0.7) {
            const currentValue = parseInt(hourInput.value) || 8;
            const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newValue = Math.max(1, Math.min(12, currentValue + randomChange));
            if (newValue !== currentValue) {
                hourInput.value = newValue;
                // Add a shake animation
                hourInput.style.animation = 'shake 0.3s ease-in-out';
                setTimeout(function() {
                    hourInput.style.animation = '';
                }, 300);
            }
        }
        
        if (minuteInput && document.activeElement !== minuteInput && Math.random() > 0.7) {
            const currentValue = parseInt(minuteInput.value) || 0;
            const randomChange = Math.floor(Math.random() * 11) - 5; // -5 to +5
            const newValue = Math.max(0, Math.min(59, currentValue + randomChange));
            if (newValue !== currentValue) {
                minuteInput.value = newValue;
                // Add a shake animation
                minuteInput.style.animation = 'shake 0.3s ease-in-out';
                setTimeout(function() {
                    minuteInput.style.animation = '';
                }, 300);
            }
        }
    }, 2000); // Check every 2 seconds
}

// Start AM/PM button chaos - randomly flip buttons
function startAMPMChaos() {
    ampmChaosInterval = setInterval(function() {
        // Only do chaos if alarm is not ringing (we'll do special chaos during alarm)
        if (isAlarmRinging) return;
        
        // Randomly flip AM/PM buttons (20% chance)
        if (Math.random() > 0.8) {
            const amBtn = document.getElementById('amBtn');
            const pmBtn = document.getElementById('pmBtn');
            
            if (amBtn && pmBtn) {
                // Swap button positions
                const parent = amBtn.parentElement;
                if (parent) {
                    if (amBtn.nextSibling === pmBtn) {
                        parent.insertBefore(pmBtn, amBtn);
                    } else {
                        parent.insertBefore(amBtn, pmBtn);
                    }
                }
                
                // Show Thanos GIF for 1-2 seconds
                showThanosGif();
                
                // Show rage message
                const messages = ['Niqqa AM set kor', 'Niqqa change it to PM'];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showMessage(randomMessage, 'warning');
            }
        }
    }, 4000); // Check every 4 seconds
}

// Show Thanos GIF with screen shake
function showThanosGif() {
    const gifContainer = document.getElementById('gifContainer');
    const thanosGif = document.getElementById('thanosGif');
    
    if (!gifContainer || !thanosGif) return;
    
    // Set GIF source
    thanosGif.src = THANOS_GIF_URL;
    
    // Show container
    gifContainer.classList.remove('hidden');
    
    // Start screen shake
    startScreenShake();
    
    // Hide after 1-2 seconds (random)
    const hideDelay = 1000 + Math.random() * 1000; // 1-2 seconds
    thanosGifTimeout = setTimeout(function() {
        gifContainer.classList.add('hidden');
        stopScreenShake();
    }, hideDelay);
}

// Start screen shake
function startScreenShake() {
    const body = document.body;
    if (!body) return;
    
    // Add shake class
    body.classList.add('screen-shaking');
    
    // Keep shaking while GIF is visible
    if (screenShakeInterval) {
        clearInterval(screenShakeInterval);
    }
    
    screenShakeInterval = setInterval(function() {
        if (!body.classList.contains('screen-shaking')) {
            clearInterval(screenShakeInterval);
            screenShakeInterval = null;
        }
    }, 100);
}

// Stop screen shake
function stopScreenShake() {
    const body = document.body;
    if (!body) return;
    
    body.classList.remove('screen-shaking');
    
    if (screenShakeInterval) {
        clearInterval(screenShakeInterval);
        screenShakeInterval = null;
    }
}

// Update AM/PM button states
function updateAMPMButtons() {
    const amBtn = document.getElementById('amBtn');
    const pmBtn = document.getElementById('pmBtn');
    
    if (amBtn && pmBtn) {
        if (currentAMPM === 'AM') {
            amBtn.style.opacity = '1';
            amBtn.style.transform = 'scale(1.1)';
            pmBtn.style.opacity = '0.5';
            pmBtn.style.transform = 'scale(0.9)';
        } else {
            pmBtn.style.opacity = '1';
            pmBtn.style.transform = 'scale(1.1)';
            amBtn.style.opacity = '0.5';
            amBtn.style.transform = 'scale(0.9)';
        }
    }
}

// Create a new alarm - the moment of truth
function createAlarm() {
    const hour = parseInt(document.getElementById('hourInput').value) || 8;
    const minute = parseInt(document.getElementById('minuteInput').value) || 0;
    
    // Convert to 24-hour format
    let hour24 = hour;
    if (currentAMPM === 'AM' && hour === 12) {
        hour24 = 0;
    } else if (currentAMPM === 'PM' && hour !== 12) {
        hour24 = hour + 12;
    }
    
    // Validate time (sort of)
    if (hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59) {
        showMessage('Invalid time! (But we\'ll set it anyway because we don\'t care.)', 'warning');
    }
    
    // Create alarm object
    const alarm = {
        id: Date.now() + Math.random(), // Unique ID (sort of)
        hour: hour24,
        minute: minute,
        enabled: true,
        createdAt: new Date()
    };
    
    alarms.push(alarm);
    saveAlarmsToStorage();
    updateAlarmList();
    
    // Show success message (sometimes)
    if (Math.random() > 0.5) {
        showMessage('Alarm created! Your suffering is scheduled.', 'success');
    }
}

// Update the alarm list display
function updateAlarmList() {
    const alarmsContainer = document.getElementById('alarmsContainer');
    if (!alarmsContainer) return;
    
    if (alarms.length === 0) {
        alarmsContainer.innerHTML = '<p class="text-center text-gray-500 italic">No alarms set. Your mornings are safe... for now.</p>';
        return;
    }
    
    let html = '';
    alarms.forEach(function(alarm) {
        const hour12 = alarm.hour === 0 ? 12 : (alarm.hour > 12 ? alarm.hour - 12 : alarm.hour);
        const ampm = alarm.hour >= 12 ? 'PM' : 'AM';
        const timeString = String(hour12).padStart(2, '0') + ':' + String(alarm.minute).padStart(2, '0') + ' ' + ampm;
        
        html += `
            <div class="bg-gray-100 p-4 rounded-lg mb-2 transform rotate-${Math.random() > 0.5 ? '1' : '-1'}" style="border: 2px solid #${Math.floor(Math.random()*16777215).toString(16)};">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-lg" style="color: #${Math.floor(Math.random()*16777215).toString(16)};">${timeString}</p>
                    </div>
                    <button class="delete-alarm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" data-alarm-id="${alarm.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    alarmsContainer.innerHTML = html;
    
    // Add delete button listeners
    const deleteButtons = alarmsContainer.querySelectorAll('.delete-alarm');
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const alarmId = parseFloat(btn.getAttribute('data-alarm-id'));
            deleteAlarm(alarmId);
        });
    });
}

// Delete an alarm
function deleteAlarm(alarmId) {
    alarms = alarms.filter(function(alarm) {
        return alarm.id !== alarmId;
    });
    saveAlarmsToStorage();
    updateAlarmList();
    showMessage('Alarm deleted. (Maybe.)', 'info');
}

// Start checking for alarms - the main loop
function startAlarmChecker() {
    setInterval(function() {
        if (isAlarmRinging) return; // Don't check if alarm is already ringing
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Check each alarm
        alarms.forEach(function(alarm) {
            if (!alarm.enabled) return;
            if (alarm.hour === currentHour && alarm.minute === currentMinute && now.getSeconds() < 5) {
                // Alarm time! Time to wake up!
                triggerAlarm(alarm);
            }
        });
    }, 1000); // Check every second (because we're thorough)
}

// Trigger an alarm - the main event
function triggerAlarm(alarm) {
    if (isAlarmRinging) return; // Don't trigger if already ringing
    
    isAlarmRinging = true;
    activeAlarmId = alarm.id;
    
    // Show the active alarm display
    const activeAlarm = document.getElementById('activeAlarm');
    if (activeAlarm) {
        activeAlarm.classList.remove('hidden');
        
        // Update alarm time
        const activeAlarmTime = document.getElementById('activeAlarmTime');
        if (activeAlarmTime) {
            const hour12 = alarm.hour === 0 ? 12 : (alarm.hour > 12 ? alarm.hour - 12 : alarm.hour);
            const ampm = alarm.hour >= 12 ? 'PM' : 'AM';
            activeAlarmTime.textContent = String(hour12).padStart(2, '0') + ':' + String(alarm.minute).padStart(2, '0') + ' ' + ampm;
        }
    }
    
    // Play the alarm sound
    if (alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.volume = 0.3; // Start at low volume
        
        const playPromise = alarmSound.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                console.log('Alarm sound is playing');
                
                // Start gradually increasing volume
                startVolumeIncrease();
            }).catch(function(error) {
                console.error('Failed to play alarm sound:', error);
                showMessage('Alarm sound failed to play. Browser may require user interaction first.', 'error');
            });
        }
    }
    
    // Start stop button chaos
    startStopButtonChaos();
    
    // Try to vibrate (if supported)
    if (navigator.vibrate) {
        const vibratePattern = [200, 100, 200, 100, 200, 100, 200];
        navigator.vibrate(vibratePattern);
        
        // Keep vibrating
        const vibrateInterval = setInterval(function() {
            if (isAlarmRinging) {
                navigator.vibrate(vibratePattern);
            } else {
                clearInterval(vibrateInterval);
            }
        }, 2000);
    }
}

// Start gradually increasing volume
function startVolumeIncrease(startVolume) {
    if (volumeIncreaseInterval) {
        clearInterval(volumeIncreaseInterval);
    }
    
    let currentVolume = startVolume || 0.3; // Use provided start volume or default to 0.3
    const maxVolume = 1.0;
    const increment = 0.05;
    
    volumeIncreaseInterval = setInterval(function() {
        if (!isAlarmRinging || !alarmSound) {
            clearInterval(volumeIncreaseInterval);
            volumeIncreaseInterval = null;
            return;
        }
        
        if (currentVolume < maxVolume) {
            currentVolume = Math.min(maxVolume, currentVolume + increment);
            alarmSound.volume = currentVolume;
        } else {
            clearInterval(volumeIncreaseInterval);
            volumeIncreaseInterval = null;
        }
    }, 500); // Increase every 500ms
}

// Start stop button chaos - moves randomly, changes color, alternates text
function startStopButtonChaos() {
    const stopBtn = document.getElementById('stopBtn');
    if (!stopBtn) return;
    
    let isStopText = true; // Toggle between "STOP" and "EEE cdi"
    
    stopButtonChaosInterval = setInterval(function() {
        if (!isAlarmRinging || !stopBtn) {
            clearInterval(stopButtonChaosInterval);
            stopButtonChaosInterval = null;
            return;
        }
        
        // Randomly move button
        const randomX = (Math.random() - 0.5) * 100; // -50 to +50 pixels
        const randomY = (Math.random() - 0.5) * 100;
        const randomRotate = (Math.random() - 0.5) * 20; // -10 to +10 degrees
        
        stopBtn.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        
        // Change color rapidly
        const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        stopBtn.style.backgroundColor = randomColor;
        
        // Alternate text
        isStopText = !isStopText;
        stopBtn.textContent = isStopText ? 'STOP' : 'EEE cdi';
        
    }, 300); // Update every 300ms for maximum chaos
}

// Handle stop alarm
function handleStopAlarm() {
    if (!isAlarmRinging) return;
    
    // Sometimes require multiple clicks
    if (Math.random() > 0.7) {
        showMessage('Stop button clicked. Processing... (Try again.)', 'warning');
        return;
    }
    
    // Stop everything
    stopAlarm();
    
    // Show success message (sometimes)
    if (Math.random() > 0.5) {
        showMessage('Alarm stopped. You survived!', 'success');
    }
}

// Handle snooze - 5 seconds (as requested)
let snoozeTimeout = null; // Track snooze timeout
function handleSnooze() {
    if (!isAlarmRinging) return;
    
    // Stop current alarm
    stopAlarm();
    
    // Clear any existing snooze timeout
    if (snoozeTimeout) {
        clearTimeout(snoozeTimeout);
    }
    
    // Show initial message
    showMessage('Snooze activated. 5 seconds of peace...', 'info');
    
    // After 5 seconds, start ringing again with more volume
    snoozeTimeout = setTimeout(function() {
        // Show big message
        showBigMessage('Niqqa 8 tay EEE CT uthe por');
        
        // Start alarm again with higher volume
        if (alarmSound) {
            alarmSound.currentTime = 0;
            alarmSound.volume = 0.7; // Start at higher volume
            
            const playPromise = alarmSound.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log('Snooze alarm is playing');
                    
                    // Set alarm as ringing
                    isAlarmRinging = true;
                    
                    // Show active alarm display
                    const activeAlarm = document.getElementById('activeAlarm');
                    if (activeAlarm) {
                        activeAlarm.classList.remove('hidden');
                    }
                    
                    // Start volume increase from higher base
                    startVolumeIncrease(0.7); // Start from 0.7 instead of 0.3
                    
                    // Start stop button chaos
                    startStopButtonChaos();
                    
                    // Try to vibrate
                    if (navigator.vibrate) {
                        const vibratePattern = [200, 100, 200, 100, 200, 100, 200];
                        navigator.vibrate(vibratePattern);
                        
                        const vibrateInterval = setInterval(function() {
                            if (isAlarmRinging) {
                                navigator.vibrate(vibratePattern);
                            } else {
                                clearInterval(vibrateInterval);
                            }
                        }, 2000);
                    }
                }).catch(function(error) {
                    console.error('Failed to play snooze alarm:', error);
                });
            }
        }
    }, 5000); // 5 seconds
}

// Stop the alarm - the relief function
function stopAlarm() {
    isAlarmRinging = false;
    activeAlarmId = null;
    
    // Stop the sound
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmSound.volume = 0.3; // Reset volume
    }
    
    // Stop volume increase
    if (volumeIncreaseInterval) {
        clearInterval(volumeIncreaseInterval);
        volumeIncreaseInterval = null;
    }
    
    // Stop stop button chaos
    if (stopButtonChaosInterval) {
        clearInterval(stopButtonChaosInterval);
        stopButtonChaosInterval = null;
    }
    
    // Reset stop button
    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
        stopBtn.style.transform = 'rotate(-5deg)';
        stopBtn.style.backgroundColor = '#000000';
        stopBtn.textContent = 'STOP';
    }
    
    // Stop vibration
    if (navigator.vibrate) {
        navigator.vibrate(0);
    }
    
    // Hide active alarm display
    const activeAlarm = document.getElementById('activeAlarm');
    if (activeAlarm) {
        activeAlarm.classList.add('hidden');
    }
    
    // Clear snooze timeout if exists
    if (snoozeTimeout) {
        clearTimeout(snoozeTimeout);
        snoozeTimeout = null;
    }
}

// Show big message - for important announcements
function showBigMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    const defaultMessage = document.getElementById('defaultMessage');
    
    if (!messageContainer) return;
    
    // Hide default message
    if (defaultMessage) {
        defaultMessage.style.display = 'none';
    }
    
    // Create big message element
    const messageEl = document.createElement('p');
    messageEl.className = 'text-center font-bold p-4 rounded';
    messageEl.style.fontSize = '2rem';
    messageEl.style.fontWeight = '900';
    messageEl.style.color = '#ff0000';
    messageEl.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    messageEl.style.border = '4px solid #ffff00';
    messageEl.style.textShadow = '2px 2px 4px #000000';
    messageEl.style.animation = 'fade-in-out 3s ease-in-out';
    messageEl.style.transform = 'scale(1.1)';
    messageEl.textContent = message;
    
    // Add to container
    messageContainer.appendChild(messageEl);
    
    // Remove after 10 seconds
    setTimeout(function() {
        if (messageEl.parentElement) {
            messageEl.style.animation = 'fade-in-out 1s ease-in-out';
            setTimeout(function() {
                if (messageEl.parentElement) {
                    messageEl.parentElement.removeChild(messageEl);
                }
                
                // Show default message if no messages left
                if (messageContainer.children.length === 0 && defaultMessage) {
                    defaultMessage.style.display = 'block';
                }
            }, 1000);
        }
    }, 10000);
}

// Show message in message area
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const defaultMessage = document.getElementById('defaultMessage');
    
    if (!messageContainer) return;
    
    // Hide default message
    if (defaultMessage) {
        defaultMessage.style.display = 'none';
    }
    
    // Create message element
    const messageEl = document.createElement('p');
    messageEl.className = 'text-center font-bold p-2 rounded';
    messageEl.style.animation = 'fade-in-out 2s ease-in-out';
    
    // Set color based on type
    switch(type) {
        case 'success':
            messageEl.style.color = '#00ff00';
            messageEl.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            break;
        case 'error':
            messageEl.style.color = '#ff0000';
            messageEl.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            break;
        case 'warning':
            messageEl.style.color = '#ffaa00';
            messageEl.style.backgroundColor = 'rgba(255, 170, 0, 0.2)';
            break;
        case 'info':
        default:
            messageEl.style.color = '#0088ff';
            messageEl.style.backgroundColor = 'rgba(0, 136, 255, 0.2)';
            break;
    }
    
    messageEl.textContent = message;
    
    // Add to container
    messageContainer.appendChild(messageEl);
    
    // Remove after 5 seconds
    setTimeout(function() {
        if (messageEl.parentElement) {
            messageEl.style.animation = 'fade-in-out 1s ease-in-out';
            setTimeout(function() {
                if (messageEl.parentElement) {
                    messageEl.parentElement.removeChild(messageEl);
                }
                
                // Show default message if no messages left
                if (messageContainer.children.length === 0 && defaultMessage) {
                    defaultMessage.style.display = 'block';
                }
            }, 1000);
        }
    }, 5000);
}

// Show modal
function showModal(message) {
    const modal = document.getElementById('annoyingModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (!modal || !modalMessage) return;
    
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
}

// Hide modal
function hideModal() {
    const modal = document.getElementById('annoyingModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Show toast notification
function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'bg-white rounded-lg shadow-2xl p-4 mb-2 transform -rotate-1';
    toast.style.border = '3px solid #ff00ff';
    toast.style.minWidth = '250px';
    toast.style.maxWidth = '300px';
    toast.style.animation = 'slide-in-right 0.3s ease-out';
    
    let borderColor = '#ff00ff';
    let textColor = '#000000';
    
    switch(type) {
        case 'success':
            borderColor = '#00ff00';
            textColor = '#006600';
            break;
        case 'error':
            borderColor = '#ff0000';
            textColor = '#990000';
            break;
        case 'warning':
            borderColor = '#ffaa00';
            textColor = '#884400';
            break;
        case 'info':
            borderColor = '#0088ff';
            textColor = '#004488';
            break;
    }
    
    toast.style.borderColor = borderColor;
    toast.style.color = textColor;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(function() {
        toast.style.animation = 'slide-out-right 0.3s ease-in';
        setTimeout(function() {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Save alarms to localStorage
function saveAlarmsToStorage() {
    try {
        localStorage.setItem('worstAlarmClock_alarms', JSON.stringify(alarms));
    } catch (error) {
        console.error('Failed to save alarms to localStorage:', error);
    }
}

// Load alarms from localStorage
function loadAlarmsFromStorage() {
    try {
        const saved = localStorage.getItem('worstAlarmClock_alarms');
        if (saved) {
            alarms = JSON.parse(saved);
            updateAlarmList();
        }
    } catch (error) {
        console.error('Failed to load alarms from localStorage:', error);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-right {
        from {
            transform: translateX(100%) rotate(-1deg);
            opacity: 0;
        }
        to {
            transform: translateX(0) rotate(-1deg);
            opacity: 1;
        }
    }
    
    @keyframes slide-out-right {
        from {
            transform: translateX(0) rotate(-1deg);
            opacity: 1;
        }
        to {
            transform: translateX(100%) rotate(-1deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// That's all, folks! Your nightmare is complete.
