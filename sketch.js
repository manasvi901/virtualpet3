var dog,happyDog,foodS,foodStock,database,position;
var ftp,otaf;  
var fedTime, lastFed;
var changingGamestate, readingGamestate;
var bedroomimg,gardenimg,washroomimg;
// **ftp=feed the pet **otaf=one to add food

function preload(){
     dog = loadImage("images/dogImg.png"); 
     happyDog = loadImage("images/dogImg1.png");
     bedroomimg = loadImage("images/dogImg1.png");
     gardenimg = loadImage("images/dogImg1.png");
     washroomimg = loadImage("images/dogImg1.png");
}

function setup() {
    createCanvas(500, 500);
    database=firebase.database();
    foodStock=database.ref('Food');
    foodStock.on("value",readStock);
    image(dog, 250, 250, 50, 50);
    image(happyDog, 250, 250, 50, 50);

    foodObj = new Food();

    feed=createButton("Feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

    //read game state from database
    readState=database.ref('gameState');
    readStae.on("value",function(data){
        gameState=data.val();
    });
}


function draw() {  
    background(46, 139, 87);
   
fedTime=database.ref('Feed Time');
fedTime.on("value",function(data){
    lastFed=data.val();
});

    foodObj.diplay();

    fill(255,255,254);
    textSize(15);

    if(lastFed>=12){
        text("Last feed :" +lastFed%12 + "PM",350,30);
    }else if(lastFed==0){
        text("Last feed : 12 AM",350,30);
    }else{
        text("Last feed :" +lastFed+"AM",350,30)
    }

    if(gameState!="Hungry"){
        feed.hide();
        addFood.hide();
        dog.remove();
    }else{
        feed.show();
        addFood.show();
        dog.addImage(sadDog);
    }

    //function to update gamestates in database
    function update(state){
        database.ref('/').update({
            gameState:state
        });
    } 

    drawSprites();
}

function feedDog(){
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
        Food:foodObj.getFoodStock(),
        FeedTime:hour()
    })
}

function addFoods(){
    foodS++;
    database.ref('/').update({
        Food:foodS
    })
}

function readStock(data){
foodS=data.val();
}

function writeStock(x){
    if (x<=0){
        x=0;
    }
    else{
        x=x-1;
    }
    database.ref("/").update({
        Food:x
    })
}
