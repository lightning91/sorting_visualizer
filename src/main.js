var values = [];
var states = []
var length;
var speed = 30;
var w = 5;
var item = "quickSort";
var rem = true;
var canvas = document.querySelector('canvas');
var range = document.querySelector("#sortRange");
var button = document.querySelector("#button");
var select = document.querySelector("#sortSelect");
var newArr = document.querySelector("#newArr");
canvas.width = 800;
canvas.height = window.innerHeight-60;
var ctx = canvas.getContext('2d');
length = Math.floor(canvas.width/w);
values = new Array(length);
function createArr(){
  if(rem == true){
    for(let i=0;i<values.length;i++){
      values[i] = Math.random()*(canvas.height-20)+20;
      states[i] = -1;
    }
  }
}
createArr();

range.addEventListener("input",sortRange);
button.addEventListener("click",sort);
select.addEventListener("change",sortChange);
newArr.addEventListener("click",createArr)

async function sort(){
  if (rem == true){
    rem = false;
    switch(item){
      case "quickSort":
        await quickSort(values,0,length-1);
        finisher();
        rem = true;
        break;
      case "mergeSort":
        await getMergeSortAnimations(values);
        finisher();
        rem = true;
        break;
      case "selectionSort":
        await selectionSort(values,0,length);
        finisher();
        rem = true;
        break;
    }
  }
}
function sortRange(){
  if (rem == true){
    w = (range.value*(70-5)/100)+5;
    speed = (range.value*(100-30)/100)+30;
  }
}
function sortChange(){
  if (rem == true){
    item = select.value;
  }
}

draw();


async function quickSort(arr, start, end) {
  if (start >= end) {
    return;
  }
  let index = await partition(arr, start, end);
  states[index] = -1;

  await Promise.all([
    quickSort(arr, start, index - 1),
    quickSort(arr, index + 1, end)
  ]);
}

async function partition(arr, start, end) {
  for (let i = start; i <= end; i++) {
    states[i] = 1;
  }

  let pivotValue = arr[end];
  let pivotIndex = start;
  states[pivotIndex] = 0;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      await swap(arr, i, pivotIndex);
      states[pivotIndex] = -1;
      pivotIndex++;
      states[pivotIndex] = 0;
    }
  }
  await swap(arr, pivotIndex, end);

  for (let i = start; i <= end; i++) {
    if (i != pivotIndex) {
      states[i] = -1;
    }
  }

  return pivotIndex;
}

async function selectionSort(arr,start,length){
  for (let i = start; i < length; i++) {
    states[i] = 1;
  }
  for(var i=0;i<length;i++){
    min_index = i;
    states[min_index] = 0;
    for(var j=i+1;j<length;j++){
      if(arr[min_index] > arr[j]){
        await sleep(speed);
        states[min_index] = -1;
        min_index = j;
        states[min_index] = 0;
      }
    }
    //states[i] = 0;
    await swap(arr,i,min_index);
    states[min_index] = -1;
    //states[i] = -1;

  }
  for (let i = start; i < length; i++) {
    states[i] = -1;
  }
}


async function getMergeSortAnimations(array){
  var mainArray = array.slice();
  var copy = array.slice();
  await mergeSortHelper(mainArray, 0, length - 1, copy);
  return mainArray;
}

async function mergeSortHelper(mainArray,startIdx,endIdx,copy) {
  if (startIdx === endIdx) {
    return mainArray;
  }
  const middleIdx = Math.floor((startIdx + endIdx) / 2);

  await mergeSortHelper(copy, startIdx, middleIdx, mainArray);
  await mergeSortHelper(copy, middleIdx + 1, endIdx, mainArray);
  await doMerge(mainArray, startIdx, middleIdx, endIdx, copy);
}

async function doMerge(mainArray,startIdx,middleIdx,endIdx,copy) {
  for (let i = startIdx; i <= endIdx; i++) {
    states[i] = 1;
  }
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    if (copy[i] <= copy[j]) {
      states[i] = 0;
      states[j] = 0;
      await sleep(speed);
      states[i] = -1;
      states[j] = -1;
      values[k] = copy[i];
      mainArray[k] = copy[i];
      i++;
      k++;

    }
    else {
      states[i] = 0;
      states[j] = 0;
      await sleep(speed);
      states[i] = -1;
      states[j] = -1;
      values[k] = copy[j];
      mainArray[k] = copy[j];
      k++;
      j++;
    }
  }
  while (i <= middleIdx) {
    //states[i] = 0;
    await sleep(speed);
    //states[i] = -1;
    values[k] = copy[i];
    mainArray[k] = copy[i];
    i++;
    k++;
  }
  while (j <= endIdx) {
    //states[j] = 0;
    await sleep(speed);
    //states[j] = -1;
    values[k] = copy[j];
    mainArray[k] = copy[j];
    j++;
    k++;
  }
  for (let i = startIdx; i <= endIdx; i++) {
    states[i] = -1;
  }
}

async function swap(arr,a,b){
  await sleep(speed);
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//console.log(values)

async function finisher(){
  for (let i = 0; i <= length; i++) {
    states[i] = 0;
    await sleep(30);
    states[i] = 1;
  }
  for (let i = 0; i <= length; i++) {
    states[i] = -1;
  }
}



function draw(){
  length = Math.floor(canvas.width/w);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(i=0;i<length;i++){
    ctx.beginPath();
    ctx.rect(w*i,canvas.height-values[i],w,values[i]);
    if (states[i] == 0){
      ctx.fillStyle = '#E0777D';
    }else if(states[i] == 1){
      ctx.fillStyle = '#A1CF7E';
    }else{
    ctx.fillStyle = '#4E6EAD';
    }
    ctx.strokeStyle = "#D8D7D8";
    ctx.fill();
    ctx.stroke();
    //console.log(values);
  }
    requestAnimationFrame(draw);
}
