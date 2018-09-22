var Date;
var SelectedDay = 0;
var day;
var counter=0;
var eventTypes = ['','Meeting', 'Appointment', 'Task'];
var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];


window.onload = function(){
    
    var selectedDate = sessionStorage.getItem('selectedDate'); //getting selected date

    document.getElementById("thisDate").innerHTML = selectedDate;
    //printing out selected date ^^^^^^^^^
   // console.log('selectedDate is: '+selectedDate);
    SelectedDay=selectedDate;

    //getting the days events stored information
    day = JSON.parse(sessionStorage.getItem(SelectedDay));
    if(day==null){
        day=0;
    }
   // console.log('the data is : '+day);
    

    var arrayRange = Object.keys(day).length;
    //console.log('the range is ' + arrayRange);
    
    //loading in the events
    counter=arrayRange;
    if(arrayRange=>1){
        for(var i=0; i < arrayRange;i++){
              loadEvents(i);
         //   console.log(i);
        }
    }
    //getting weather for the day
        var dayTemp; // holding grabbed data
        var ActualDay = sessionStorage.getItem('Today'); 
        //string to arrays
        ActualDay = ActualDay.split(',');
        mySelectedDay = selectedDate.split(' ');
    

    //console.log('the selected day is: ' + mySelectedDay[1]);
    //console.log('todays day is: '+ ActualDay[0]);
    
    var todayDay = parseInt(ActualDay[0]);
    
    var selectedMonth = parseInt(mySelectedDay[0]);
    //console.log(actualMonth +'and'+ selectedMonth)
    
    //running only if the date is in the given range
 //   console.log('hi ' + todayDay )
    
    //checking to see if it's within the range - this section has some holes in it though... ie. If it's late sept 29 then Oct weather wont show even though it should.. I have a fix but didn't have the time to implement it
    if(mySelectedDay[1] >=todayDay && mySelectedDay[1] < (todayDay+10) && mySelectedDay[2]==ActualDay[2]){
        getWeatherAw(mySelectedDay[1],ActualDay[0]).then(data => {
            dayTemp = data;
          //  console.log(dayTemp);
           
            var myI = mySelectedDay[1] - ActualDay[0];
         //   console.log('boom ' + myI);
            let day1 = dayTemp[myI].high;
            
            document.getElementById("daysWeather").innerHTML =`Today's weather in Vancouver should be ${day1} fahrenheit.`;  
        });
        
    }else{
        document.getElementById("daysWeather").innerHTML = 'There is no forcasted weather for the day.'
    }

}

//getting weather
async function getWeatherAw(myDay,today){
    
    try{
        const result = await fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22vancouver%2Cil%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");
//console.log('my day is like: ' +  myDay);
        const data = await result.json();
        //today current weather day
        var dayTemp = data.query.results.channel.item.forecast;

       // console.log(dayTemp); //showing full grabbed data
       // console.log('todays temp is ' + dayTemp ); //logging grabbed data
        return dayTemp;
    } catch(error) {
      //  console.log('Sorry there is no avaliable weather for the day.' + error);
    }

}

function CreateEvent(){
    
    //check to see if an array exists and if it does create it 
    day = ( typeof day != 'undefined' && day instanceof Array ) ? day : []
    
    var eventName = document.getElementById('event-name').value;
   
    var eventTypeNumber = document.getElementById('inlineFormCustomSelect').value; 
    // 1 = Meeting ,2 = Appointment ,3 = Task
    
    //putting event in array
  //  console.log(eventTypeNumber);
    var eventType = eventTypes[eventTypeNumber];
    day[counter] = [eventName, eventType];
   // console.log('event type is: ' + eventTypeNumber);
     /*

    */
    
     ///store day in array
    loadEvents(counter);
    counter++;
       
    //putting array data into a string
    sessionStorage.setItem(SelectedDay, JSON.stringify(day));
  //  console.log('saved and the value is: '+SelectedDay);
    
 //   console.log('array range is: '+ day.length);
    //clearing elements once submitted
    document.getElementById('exampleModal').modal('hide');
    clearForm();
   // console.log('the array is : '+day)
    
        //close modal and reset required feilds
    
}

function loadEvents(counter){ //loading in events
        var shownText = day[counter]
//adding in initial event
    
       list = document.getElementById('eventlist');
       var entry = document.createElement('li');
       entry.classList.add("list-group-item");
        
    
       entry.classList.add(id=`${counter}`); //id for help to delete item
    
//adding in delete button

    
    
        
        //console.log('here i am: ' + shownText[1]); //shows if it's an appointment, meeting, or task
    
        entry.appendChild(document.createTextNode(`${shownText[0]} --- ${shownText[1]}`));
        

    
       list.appendChild(entry);//adding entry to list   
    //adding in delete button and function of it
        var button = document.createElement('button');
        button.innerHTML=`<span><i class="fas fa-trash-alt"></i><span>`;
        button.classList.add(id=`btn`);
        button.classList.add(id=`btn-danger`);
        button.classList.add(id=`float-right`);
        button.classList.add(id=`eventDelete${counter}`)
        button.onclick = function (){deleteEvent(this)};
        //addEventListener=('click',deleteEvent());
        entry.appendChild(button);
}

function saveData(){//sending back to home page
//console.log('it saves! and the day is: '+ SelectedDay); 
    sessionStorage.setItem('SingleDay',SelectedDay);

    var mCount=0, aCount=0, tCount=0;
    //Event counter for the day
    var DaysEvents = [mCount, aCount, tCount];
    //saving the event counters in sessionStorage
    sessionStorage.setItem(SelectedDay+'Events',DaysEvents);
    if(day != undefined){
        for(var i=0;i<day.length;i++){
           // console.log(day[i][1]);
          var temp = day[i][1];
            if(temp == 'Meeting'){
                mCount++;
            }else if (temp == 'Appointment'){
                aCount++;
            }else if (temp == 'Task'){
                tCount++;
            }
        }
    }
///saving counter information

   
//printing day event counters
 //   console.log(`the event break down is: Meetings: ${mCount} Appointments : ${aCount} Tasks: ${tCount}`);
  //  console.log(day); //printing the days events
    
    
//storying the events in an array
    var tempEvents = [mCount,aCount,tCount];
    
  //  console.log('it saves! and the day is: '+ SelectedDay);
   // console.log('the array its stored in is: '+tempEvents);
    var temp = SelectedDay.split(' ');
    //storing counter off event types
    sessionStorage.setItem(SelectedDay+'eventCounter',tempEvents);
    
   window.location.href = "index.html";
}

function clearForm(){
    document.getElementById('inlineFormCustomSelect').value = 0;
    document.getElementById('event-name').value = "";
}

function deleteEvent(object){
    
    var OGparent = object.parentElement;
    var olderParnet = OGparent.classList[1];
    var content =day[olderParnet];
    
  //  console.log(`fere is the days events: ${content} and the array position: ${olderParnet}`);
   
//delete html section
    OGparent.parentElement.removeChild(OGparent);
//delete data from array
    
   // console.log(day);
   // console.log(content);
    for(var i=0;i<=day.length;i++){
        if(day[i]==content){
           // console.log(`${day[i]} equals ${content}`);
            day.splice(i,1);
        }
    }
        
        
    //console.log(day);
   // console.log('the id is:' + olderParnet);
    
    //saving data 
    sessionStorage.setItem(SelectedDay, JSON.stringify(day));
    
}
