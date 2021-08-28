let request=require('request');
let cheerio=require('cheerio');
let fs=require('fs');
let path=require('path');
let iss=require('./issue.js')
let PDFDocument=require('pdfkit')
//const { doesNotMatch } = require('assert/strict');

url="https://github.com/topics";
request(url,cb);
function cb(error,response,html){
    if(error)
    console.log("you got error");
    else if(response.statusCode==404)
    console.log("you are trying to access the page that doesn't exist");
    else
    getTopicsUrl(html);
}
function getTopicsUrl(html){
    let searchTool=cheerio.load(html);
    let aElem=searchTool(".no-underline.d-flex.flex-column.flex-justify-center");
    //let aElem=searchTool(className).find('a');
    //console.log(aElem[1]);
    for(let i=0;i<aElem.length;i++){
            let link=searchTool(aElem[i]).attr('href');
            let fullLink=`https://github.com/${link}`;
            let topicName=fullLink.split('/').pop();
            let topicFolder=path.join(process.cwd(),topicName);
            if(fs.existsSync(topicFolder)==false)
            fs.mkdirSync(topicFolder);
            temp1(fullLink,topicFolder);
            
    }
}

function temp1(fullLink,topicFolder){
    request(fullLink,cb2);
    function cb2(err,response,html){
    if(err)
    console.log("error in callback2");
    else if(response.statusCode==404)
    console.log("page not found");
    else{
    getRepoLink(html,topicFolder);
    }
 }
}


function getRepoLink(html,topicFolder){
    let searchTool=cheerio.load(html);
    let className=searchTool(".f3.color-text-secondary.text-normal.lh-condensed");//class of all repos
    for(let i=0;i<8;i++){
        let aElem=searchTool(className[i]).find('a');
        let link=searchTool(aElem[1]).attr('href');
        let fullLink=`https://github.com${link}`;
        let repoName=fullLink.split("/").pop();
        let repoFile=path.join(topicFolder,repoName+".pdf");
        // if(fs.existsSync(repoName)==false)

        iss.fxn(fullLink,topicFolder,repoFile);//Now call to next page

    }

}

