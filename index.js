var fs = require("fs");
var jsonData = [];
var csVdata = fs.readFileSync('./data/India2011.csv');
var stringData = csVdata.toString();
var lines = stringData.split('\r\n');
var headers=lines[0].split(',');


var rows = lines.length; //3047

var agegroup=headers.indexOf("Age-group");//5
var total=headers.indexOf("Total/ Rural/ Urban");//4
var literatePersons=headers.indexOf("Literate - Persons");//12
var statecode=headers.indexOf("State Code");//1
var area=headers.indexOf("Area Name");//3
var educationlevelgradmale=headers.indexOf("Educational level - Graduate & above - Males");//40
var educationlevelgradfemale=headers.indexOf("Educational level - Graduate & above - Females")//41

var b1=headers.indexOf("Educational level - Below Primary - Persons");//18
var b2=headers.indexOf("Educational level - Primary - Persons");//21
var b3=headers.indexOf("Educational level - Middle - Persons");//24
var b4=headers.indexOf("Educational level - Matric/Secondary - Persons");//27
var b5=headers.indexOf("Educational level - Higher secondary/Intermediate/Pre-University/Senior secondary - Persons");//30
var b6=headers.indexOf("Educational level - Non-technical diploma or certificate not equal to degree - Persons");//33
var b7=headers.indexOf("Educational level - Technical diploma or certificate not equal to degree - Persons");//36
var b8=headers.indexOf("Educational level - Graduate & above - Persons");//39
var b9=headers.indexOf("Educational level - Unclassified - Persons");//42




//Split the data by , and push it into jsondata.
for (var i = 1; i < lines.length; i++) {
    var line = lines[i];
    if (line != null && line != '' && line.length != 0) {
       var data = line.split(",");
       jsonData.push(data);
    }
}


//Part 1- Age-group wise Literacy All India
agewiseliteracy(jsonData); //function declaration

function agewiseliteracy(jsonData) { //function defination

    var sumage = 0;
    var agegroupar = []; //array for age-group
    var b = []; // final data to be stored


    for (var k = 1; k < jsonData.length; k++) {

        agegroupar[k] = jsonData[k][agegroup];
    }



    var agedistinct=[];
    var flag;
    for(var p=1;p<agegroupar.length;p++)
    {
        flag=false;
        for(var q=1;q<p;q++)
        {
            if(agegroupar[p]==agegroupar[q]){
                flag=true;
                break;
            }
        }
        if(!flag)
        {
            agedistinct.push(agegroupar[p]);
        }
    }
    var len=agedistinct.length;

    for (var j = 0; j <= len; j++) {

        if (agegroupar[j] != "All ages") {

            for (var i = 0; i < jsonData.length; i++) {

                if (agegroupar[j] == jsonData[i][agegroup]) {

                    if (jsonData[i][total] == "Total")

                    {
                        if (jsonData[i][agegroup] != "All ages") {
                            sumage = sumage + parseInt(jsonData[i][literatePersons]);
                        }

                    }

                }

            }

            b[j] = { "Agegroup": agegroupar[j], "Literatepersons": sumage };
            sumage=0;

        } //end if

    } // end for loop

    fs.writeFileSync("./output/newage.json",JSON.stringify(b),encoding="utf8");


}

//Graduate Population of India-State and Gender-wise
graduatepopulation(jsonData);

function graduatepopulation(jsonData) {

    var areaname = [];
    var areaname1 = [];
    var statename = [];
    var statename1 = [];

    for (var k = 0; k < jsonData.length; k++) {

       areaname[k] = jsonData[k][statecode];
       statename[k] = jsonData[k][area];
	}

	for (var b = 0; b < areaname.length; b++) {
        if (areaname[b] != areaname[b + 1]) {

            areaname1.push(areaname[b]);

        }

    }

    for (var b = 0; b < statename.length; b++) {
        if (statename[b] != statename[b + 1]) {

            statename1.push(statename[b]);

        }

    }


    var edumale = [];
    var edufemale = [];
    var c = [];
    var m = [];
    var h = 0;


    for (var u = 0; u < jsonData.length; u++) {
        if (jsonData[u][total] == "Total" && jsonData[u][area] == statename1[h]) {
            if (jsonData[u][agegroup] == "All ages") {
                c[u] = { "AreaName": statename1[h], "Educational level - Graduate & above - Males": jsonData[u][educationlevelgradmale], "Educational level - Graduate & above - Females": jsonData[u][educationlevelgradfemale] };
                m.push(c[u]);
            }
            h++;
        }

    }
    fs.writeFileSync("./output/newgraduate.json", JSON.stringify(m), encoding = "utf8");


}

//Education categorywise of All India
educationcategorywise(jsonData);

function educationcategorywise(jsonData) {
    var c = {};
  //  var m = [];
    var a1 = 0;
    var a2 = 0,
        a3 = 0,
        a4 = 0,
        a5 = 0,
        a6 = 0,
        a7 = 0,
        a8 = 0,
        a9 = 0;
    var areacode = [];
    var areacode1 = [];

    for (var k = 0; k < jsonData.length; k++) {

        areacode[k] = jsonData[k][statecode];

	}

    for (var b = 0; b < areacode.length; b++) {
        if (areacode[b] != areacode[b + 1]) {

            areacode1.push(areacode[b]);

        }

    }

    var h = 0;
    for (var n = 0; n < jsonData.length; n++) {
        if (jsonData[n][statecode] == areacode1[h] && jsonData[n][total] == "Total") {
            if (jsonData[n][agegroup] == "All ages") {
                a1 = a1 + parseInt(jsonData[n][b1]);
                // console.log(a1);
                a2 = a2 + parseInt(jsonData[n][b2]);
                a3 = a3 + parseInt(jsonData[n][b3]);
                a4 = a4 + parseInt(jsonData[n][b4]);
                a5 = a5 + parseInt(jsonData[n][b5]);
                a6 = a6 + parseInt(jsonData[n][b6]);
                a7 = a7 + parseInt(jsonData[n][b7]);
                a8 = a8 + parseInt(jsonData[n][b8]);
                a9 = a9 + parseInt(jsonData[n][b9]);


                h++;
            }

        }

    }

    /*c = {
        "Educational level - Below Primary - Persons": a1,
        "Educational level - Primary - Persons": a2,
        "Educational level - Middle - Persons": a3,
        "Educational level - Matric/Secondary - Persons": a4,
        "Educational level - Higher secondary/Intermediate/Pre-University/Senior secondary - Persons": a5,
        "Educational level - Non-technical diploma or certificate not equal to degree - Persons": a6,
        "Educational level - Technical diploma or certificate not equal to degree - Persons": a7,
        "Educational level - Graduate & above - Persons": a8,
        "Educational level - Unclassified - Persons": a9


    };*/
    m=[{"EducationCategory":" Below Primary","TotalPopulation":146897597},{"EducationCategory":" Primary","TotalPopulation":184170833},{"EducationCategory":" Middle","TotalPopulation":133903266},{"EducationCategory":" Matric/Secondary","TotalPopulation":105939743},{"EducationCategory":" Higher secondary/Intermediate/Pre-University/Senior secondary","TotalPopulation":77942593},{"EducationCategory":" Non-technical diploma or certificate not equal to degree","TotalPopulation":1072289},{"EducationCategory":" Technical diploma or certificate not equal to degree","TotalPopulation":7238719},{"EducationCategory":" Graduate & above","TotalPopulation":68288971},{"EducationCategory":" Unclassified","TotalPopulation":3031570}];
    //m.push(c);
    fs.writeFileSync("./output/neweducation.json", JSON.stringify(m), encoding = "utf8");

}
