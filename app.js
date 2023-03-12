const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    /* API থেকে ডাটা Fetch হচ্ছে */
    .then(data => {
      if(data.hits.length > 0){
        showImages(data.hits);
        errorMessage.innerText = '';
      }
      else{
        errorMessage.innerText = 'No Data Found!!';
      }
    })
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    /* Image এ Double Click করলে  Image Unselect  হবে
    sliders মানে ছবি slide-show হওয়ার জন্য তৈরি করা ‍array তে যেন unselected ছবি না add হয়, তাই ‍ুsliders এর মধ্যে filter করে বাদ দিয়ে দেওয়া হয়েছে...  
    এবং ছবির চারপাশের বর্ডারের জন্য দেওয়া 'added' classটা বাদ দিয়ে দেওয়া হয়েছে */
    sliders = sliders.filter(slider => slider !== img);
    element.classList.remove('added');
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  const duration = document.getElementById('duration').value || 1000;
  /* Photo Slide Change এর Duration Negative Value নেওয়া যাবে না  */
  if(duration < 0){
    errorMessage.innerText = 'Negative Duration is not allowed! please provide positive value.'
  }
  else{
    // hide image aria
    imagesArea.style.display = 'none';
    
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  /* Search Field কে Validate করতে */
  if(search.value.length == 0){
    errorMessage.innerText = 'Please input some text first!';
    /* search এ কোন text না থাকলে image না দেখাতে... */
    imagesArea.style.display = 'none';
  }
  else{
    getImages(search.value)
    sliders.length = 0;
    /* Search Field এর Text Clear */
    search.value = '';
    /* error message Clear করতে */
    errorMessage.innerText = '';
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})





/* Enter key trigger করতে হবে অর্থাৎ Enter Key  Press করলেও Search হবে */
search.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});