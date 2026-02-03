/* =========================
   ADVANCED BOOKING
========================= */
document.getElementById("bookingForm")?.addEventListener("submit", async e=>{
e.preventDefault();

let data={
  name:name.value,
  phone:phone.value,
  style:style.value,
  placement:placement.value,
  size:size.value,
  color:color.value,
  budget:budget.value,
  message:message.value,
  date:new Date()
};

await db.collection("clients").add(data);

let text=
`New Tattoo Booking
Name: ${data.name}
Phone: ${data.phone}
Style: ${data.style}
Placement: ${data.placement}
Size: ${data.size}
Budget: ${data.budget}`;

window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(text)}`);

alert("Booking submitted successfully!");
});

/* =========================
   GALLERY FILTER
========================= */
function filterGallery(category){
  document.querySelectorAll(".gallery img").forEach(img=>{
    img.style.display =
      category==="all" || img.dataset.category===category
      ? "block" : "none";
  });
}

/* =========================
   MODAL + SWIPE
========================= */
let startX=0;
modal?.addEventListener("touchstart",e=>{
  startX=e.touches[0].clientX;
});
modal?.addEventListener("touchend",e=>{
  let endX=e.changedTouches[0].clientX;
  if(startX-endX>50) changeSlide(1);
  if(endX-startX>50) changeSlide(-1);
});

/* =========================
   IMAGE LIBRARY
========================= */

const storage = firebase.storage();

async function uploadImage(){
  const file = document.getElementById("imgFile").files[0];
  if(!file) return alert("Select an image");

  const ref = storage.ref("tattoos/" + Date.now() + "_" + file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  await db.collection("images").add({
    url,
    name:file.name,
    created:new Date()
  });

  alert("Image uploaded");
}

db.collection("images").orderBy("created","desc")
.onSnapshot(snap=>{
  const grid = document.getElementById("imageGrid");
  if(!grid) return;
  grid.innerHTML="";
  snap.forEach(doc=>{
    const img = doc.data();
    grid.innerHTML += `<img src="${img.url}" onclick="copyURL('${img.url}')">`;
  });
});

function copyURL(url){
  navigator.clipboard.writeText(url);
  alert("Image URL copied. Paste it anywhere.");
}
/*IMAGE*/
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "stork_upload";

async function uploadImage() {
  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("Select an image");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  const img = document.createElement("img");
  img.src = data.secure_url;
  img.onclick = () => navigator.clipboard.writeText(data.secure_url);

  document.getElementById("imageGrid").appendChild(img);

  alert("Image uploaded. URL copied on click.");
}
