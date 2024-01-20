const { createCanvas } = require('canvas');

function hexColorToBase64Image(hexColor) {
    const canvas = createCanvas(1, 1); // Create a canvas
    const ctx = canvas.getContext('2d');
    // Draw a rectangle filled with the hex color
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Convert canvas content to base64 encoded image
    const base64Image = canvas.toDataURL('image/png');
    return base64Image;
}



module.exports = {
    beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        const themeColor = event.params.data.themeColor;
        const imageBlur = hexColorToBase64Image(themeColor);
        event.params.data.imageBlur = imageBlur;
    }
};