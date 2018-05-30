const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream) || HTMLMediaElement.srcObject(localMediaStream); // window.URL.createObjectURL Is being deprecated
        video.play();
      }).catch(err => {
        console.error('Your Web Cam Is Not Enabled', err);
      });
};

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    // console.log(width, height);
    // console.log(paintToCanvas);

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height); // Take Pixels Out Of Image
      let pixels = ctx.getImageData(0, 0, width, height);
      // pixels = redEffect(pixels); // Modify Pixels
      // pixels = rgbSplit(pixels); // Modify Pixels
      // ctx.globalAlpha = 0.8;
      pixels = greenScreen(pixels);
      ctx.putImageData(pixels, 0, 0); // Return Pixels To Image
    }, 16);
};

function takePhoto() {
  snap.currentTime = 0;
  snap.play(); // Camera Sound
  // Take Data FroM Canvas To Make a Photo
  const data  = canvas.toDataURL('image/jpeg'); 
  // console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'webcam-picture');
  // link.textContent = 'Download Image';
  link.innerHTML = `<img src='${data}' alt='Webcam Picture of Yourself' />`;
  strip.insertBefore(link, strip.firstChild);
};
function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // Red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // Green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    //pixels[i + 3]; // Alpha
  };
  return pixels;
};
function rgbSplit(pixels) {
   for(let i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // Red
    pixels.data[i + 500] = pixels.data[i + 1]; // Green
    pixels.data[i + 550] = pixels.data[i + 2]; // Blue
    //pixels[i + 3]; // Alpha
  };
};

function greenScreen(pixels) {
  const levels = {};
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels);

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0; //Anything Not Within The Ranges Of Min & Max Is Removed
    }
  }
  return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);


