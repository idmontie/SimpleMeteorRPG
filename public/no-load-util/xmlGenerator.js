// Generate XML SubTextures!

ar runningCount = 0;

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

document.write('<textarea>');
for (var j = 0; j < 512; j += 32) {
  for (var i = 0; i < 256; i += 32) { 
    var name = 'Terrain' + pad(runningCount, 4, '0');
    document.write('<SubTexture name="' + name + '" x="' + i + '" y="' + j + '" width="32" height="32" frameX="0" frameY="-1" frameWidth="32" frameHeight="32"/>\n');
  runningCount++;
  }
}
document.write('</textarea>');