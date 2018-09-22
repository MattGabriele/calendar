var year = new Date().getFullYear(); //2018
var month = new Date().getMonth(); //8 for Sept
var nextButton=0;
var prevButton=0;
var day;
var startDays=0;
var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var DaysEvents;
var Currentdays =0;

window.onload = function(){
    //console.log('ran!')
    if(window.location.href.match('index.html') != null){
        //initializing calendar
        clickedMonth();
        month_setup(0);
        
    }
    
}

function eventPlacer(month,i, extraDays){
    //
    //console.log(month, year);
    var realDate = i -extraDays +1;
        //putting date into an array
        var temp = [month, realDate, year];
        temp = temp.join(' ');
     //   console.log(realDate);
        var dayEvents = sessionStorage.getItem(temp+'eventCounter');
        //if there are events for the day run this section
        if(dayEvents != null){
            //console.log(temp);
            //console.log(dayEvents);
            var relly=i+extraDays
            document.getElementById(`day${i}`).innerHTML += "<br>";
            
            //adding element in
            var section = document.getElementById(`day${i}`);
            //checking to see what events are for the day
            if(dayEvents[0]>=1){ //Meeting = GREEN
                var entry = document.createElement('span');
                entry.innerHTML =dayEvents[0];
                entry.classList.add("badge");
                entry.classList.add("badge-success");
                section.appendChild(entry);
            }
            if(dayEvents[2]>=1){ //Appointment - BLACK
                var entry = document.createElement('span');
                entry.innerHTML =dayEvents[2];
                entry.classList.add("badge");
                entry.classList.add("badge-warning");
                section.appendChild(entry);
                
            }
            if(dayEvents[4]>=1){ //Task - BLUE
                var entry = document.createElement('span');
                entry.innerHTML =dayEvents[4];
                entry.classList.add("badge");
                entry.classList.add("badge-primary");
                section.appendChild(entry);
                
            }
           // console.log('the day events are: '+ dayEvents);
            //console.log(dayEvents[0]);
             //console.log(dayEvents[2]);
             //console.log(dayEvents[4]);
                        
        }

}

function clickedMonth(){
        //trying to set back to correct month after being on a single day page
        var time = sessionStorage.getItem('SingleDay'); //SelectedDay
      //  console.log('the old day is: ' + time);
        var oldyear, oldmonth;
        if(time != null){
            var time = time.split(" ");
            oldmonth = time[0]; //grabbing month from array
            oldyear = time[2];//grabbing year from array
           // console.log(`the past date is ${oldmonth} ${oldyear}`);
            //converting text month, ie September into a number
            for(var i=0; i<=month_name.length;i++){
                if(month_name[i]==oldmonth){
                    oldmonth=i; //gettig past month by click
               //     console.log('nice ' + oldmonth);
                }
            }
            month=oldmonth;
            year=parseInt(oldyear,10);//making the year string into an int
        }
}

function month_setup(extraMonth, nextButton, prevButton){
    //-----------GETTING TODAYS DATING INFORMATION---------
    var flag =0; 

    var extraStartDays= 0;
    startDays=0;
    var calender =0;
    var pagesend = 0;
    //getting day information
    var d = new Date();
   // console.log(month);
    //console.log(year);

    //-----------month and year tracker and setter
    if(month_name[month] =='December' && nextButton){ 
        //once past dec, set to jan of next year
        year += 1;
        month = 0;
       // console.log('month: '+month+' year: '+year )
    }else if(month_name[month]=='January' && prevButton){
        //once back from jan, set month to dec and of previous year 
        year -= 1; 
        month = 11;
       // console.log('month: '+month+' year: '+year )
    }else if (prevButton){
        //previous button = go back a month
        month -= 1;  
    }else if (nextButton){
        month += 1;
    }
  //  console.log('The date is month: '+month+' year: '+year )
    
    /// putting in right date
    
    
    
    //-------------------------------------------------
    //Checking if today's current date is showing on the calendar
    //console.log(`showing month: ${month} and the year is ${year} `)
    if(month == new Date().getMonth() && year ==new Date().getFullYear()){
        flag=1;
    }
    //-------------------------------------------------
    var currentDate = d.getDate();
    //console.log(currentDate);
    var first_date = month_name[month] + " " + 1 + " " + year;
    //September 1 2018
    var tmp = new Date(first_date).toDateString();
    //Mon Sep 01 2018 ...
    var first_day = tmp.substring(0, 3);    //Mon
    var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var day_no = day_name.indexOf(first_day);   //1
    day = day_no;
    Currentdays = new Date(year, month+1, 0).getDate();    //Number of days in the current month
   // console.log("days in the month: "+ Currentdays);
    var Pastdays = new Date(year, month, 0).getDate();
    //-------------------------------------------------
    
    //Calling the seperate functions
    var extraStartDays = starting_day(day_no);
    var calendar = get_calendar(day_no, Currentdays, Pastdays);
    var pagesend = send_to_page(month_name,month,year,calendar, Pastdays, extraStartDays, currentDate, flag);
    
    
    //setting for going forward a month + year
    
    //----------month and year tracker
}

//adding in the proper classes for different elements
function send_to_page(month_name,month,year,calendar, Pastdays, extraStartDays, currentDate ,flag){
    document.getElementById("monthShown").innerHTML = month_name[month]+" "+year;    
    
    document.getElementById("currentMonth").innerHTML = month_name[month];
    var extraDayCounter=1;
    for(var i=1;i<43;i++){ // looping through 42 times - 6 weeks * 7 days 
        var element = document.getElementById(`${i}`);
        
        if(calendar[i]==undefined){ //covering the end of month
            element.classList.add("next-month");
            document.getElementById(`day${i}`).innerHTML = extraDayCounter;
            extraDayCounter++;
            element.classList.remove("btn");
            element.classList.remove("btn-outline-secondary");
            element.onclick = function (){return false};
        }else if(i<extraStartDays+1){ //covering the start of the month
            startDays++;
            element.classList.add("next-month");
            document.getElementById(`day${i}`).innerHTML = calendar[i];
            element.classList.remove("btn");
            element.classList.remove("btn-outline-secondary");
            element.onclick = function (){return false};
        }else{      
            //making the current month's dates into clickable buttons
            element.classList.add("btn");
            element.classList.add("btn-outline-secondary");
            
            if(calendar[i]==currentDate && flag ==1){//showing today's date
                document.getElementById(`day${i}`).innerHTML = calendar[i].fontcolor("red"); //adding font color to indicate today's current date
                element.onclick = function (){DayView(this)};
                //storing current day
                var myDay = [currentDate, month, year];
                sessionStorage.setItem('Today',myDay);

            }else{
                //in the current month but not today's date
                document.getElementById(`day${i}`).innerHTML = calendar[i];
                element.classList.remove("next-month");
                element.onclick = function (){DayView(this)};
            }
            //checking if an event is held on the given day
            element.classList.add(onclick="location.href='SingleDay.html'");
            eventPlacer(month_name[month],i,extraStartDays+1);
        }
        //console.log(month_name[month]);
        
    }
    
    
}


function DayView(object){
    var selectedDay = object.id-startDays //getting selected day
   // console.log(`The clicked day is: day: ${selectedDay} month: ${month} and year ${year} `);

    var date = `${month_name[month]} ${selectedDay} ${year}`
    //saving information then sending to selected day
    sessionStorage.setItem('selectedDate',date);
    window.location.href = "SingleDay.html" ;
   // console.log(date);
}

function starting_day(day_no){
    var extraDays = -1;
    //finding when to start the current/selected month on the calendar
    for(var i=0;i<=day_no;i++){
        extraDays++;
    }
    return extraDays;
}

function get_calendar(day_no, Currentdays, Pastdays){
    var monthDays = new Array();
    
    var extraDays = starting_day(day_no);
    
    for(var i=0;i<=day_no;i++){
        monthDays[i]=`${Pastdays - extraDays}`;
        extraDays--;
    }
    //current month starts and prints layouts dates   
    for(var i=1;i<Currentdays+1;i++){
        monthDays[i+day_no]=`${i}`;
    }
    
    return monthDays;
}