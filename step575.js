const fs = require('fs');
if (fs.existsSync('style_v2.css')) {
    let css = fs.readFileSync('style_v2.css', 'utf8');
    const lines = css.split('\n');
    lines.forEach((l, i) => {
        if(l.includes('overflow: hidden') || l.includes('overflow:hidden')) {
            console.log(`${i+1}: ${l}`);
        }
    });
}
