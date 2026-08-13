# 🎁 Interactive Birthday Proposal Website

A beautiful, interactive birthday proposal website with animations, envelope opening effect, and bright neon colors!

## ✨ Features

### **Envelope Opening Animation** 
- Click "Take a look" button to open the envelope with a 3D flip animation
- Sparkles burst around the envelope when opened
- Automatically scrolls to the next section

### **Interactive Elements**
- ✨ Floating orbs that follow your mouse
- 🎨 Colorful gradient text and buttons  
- 🌟 Smooth scrolling animations
- 💫 Sparkle effects on interactions
- 🎯 Ripple effects on button clicks
- 🎉 Confetti explosion on "Yes" button

### **Animations**
- Bouncing arrows to draw attention
- Floating animations on the envelope
- Text fades in as you scroll
- Video card lifts on hover
- Shimmer effects on text
- Glowing buttons with hover effects

## 📂 File Structure

```
birthday-proposal-site/
├── index.html          # Main HTML file
├── style.css           # All styling & animations
├── script.js           # JavaScript interactions
└── birthday-video.mp4  # Your video (you need to add this)
```

## 🚀 Setup Instructions

### 1. **Update Person's Name**
Open `script.js` and change this line:
```javascript
const HER_NAME = "Her Name";
```
To the actual name, for example:
```javascript
const HER_NAME = "Sarah";
```

### 2. **Add Your Video**
1. Create a video file named `birthday-video.mp4`
2. Place it in the same folder as your HTML file
3. The video will show as a card that she can click to play

### 3. **Customize the Message (Optional)**
In `index.html`, you can customize these messages:
- Line 27: "A LITTLE SOMETHING FOR YOU"
- Line 29: "Happy Birthday, beautiful"
- Line 40-43: Letter content inside the envelope
- Line 70-72: Video section message
- Line 98-100: Proposal message

### 4. **Open in Browser**
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

## 🎨 Color Scheme

The website uses bright, vibrant colors:
- **Hot Pink**: #ff006e
- **Cyan Blue**: #00d9ff  
- **Golden Yellow**: #ffbe0b
- **White**: #ffffff
- **Dark Navy Background**: #0a0e27

## 🎮 Interactive Features

### Envelope
1. Click "Take a look" button
2. Envelope flips open with 3D animation
3. Letter appears inside envelope
4. Sparkles burst around it
5. Automatically scrolls down

### Video Section
1. Video displays as a card
2. Click the play button to watch
3. Video automatically scrolls to proposal when finished

### Proposal
1. Two buttons: "Yes, I will" and "Let me think"
2. "Yes" button triggers confetti explosion
3. "Let me think" button has fun response

## 💡 Customization Tips

### Change Colors
In `style.css`, update the CSS variables at the top:
```css
:root{
  --accent:#ff006e;      /* Pink */
  --accent2:#00d9ff;     /* Cyan */
  --accent3:#ffbe0b;     /* Yellow */
}
```

### Disable Sound
In `script.js`, comment out or remove the `playSound()` call on line 49

### Change Animation Speed
In `style.css`, modify transition values (lower = faster):
```css
.envelope-flap{transition:all .7s cubic-bezier(...)} /* Change .7s */
```

## 📱 Mobile Responsive

The website is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones (iOS & Android)

## 🐛 Troubleshooting

### Envelope isn't opening?
- Make sure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors (F12)

### Video isn't showing?
- Make sure file is named exactly: `birthday-video.mp4`
- File must be in the same folder as `index.html`
- Try using a different video format or codec

### Colors look different?
- Different browsers may render colors slightly differently
- Try updating your browser to the latest version

## 🎯 Browser Compatibility

- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 14+)
- ✅ Edge
- ⚠️ Internet Explorer (Not supported)

## 📝 Notes

- All animations are smooth and GPU-accelerated
- No external dependencies required
- Uses Web Audio API for optional sound (gracefully fails if unavailable)
- Confetti uses 3 bright colors that change randomly

## 🎉 Have Fun!

This is your personal creation - make it special! Good luck with your proposal! 💕

---

**Made with 💙 for someone special**
