let request=require('request');
let cheerio=require('cheerio');
let fs=require('fs');
let path=require('path');
let PDFDocument=require('pdfkit');

function getIssue(url,topicFolder,repoFile){
    request(url,cb);
    function cb(err,response,html){
        if(err)
        console.log("error in callback of issue");
        else if(response.statusCode==404)
        console.log("Page not found in issues1");
        else
        getIssues(html);
    }
function getIssues(html){
    let searchTool=cheerio.load(html);
    let link=searchTool("#issues-tab").attr('href');
    let fullLink=`https://github.com/${link}`;
    request(fullLink,cb2);
}

function cb2(err,response,html){
    if(err)
    console.log("error in callback of issue");
    else if(response.statusCode==404)
    console.log("Page not found in issues");
    else
    getDetails(html);
}
function getDetails(html){
    let searchTool=cheerio.load(html);
    let className=searchTool(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
    
    //storing all the link of issues in an array
    let arr=[];
    for(let i=0;i<className.length;i++){
        let link=searchTool(className[i]).attr('href');
        let fullLink=`https://github.com/${link}`;
        arr.push(fullLink);
    }
    //converting json to pdf
    let text=JSON.stringify(arr);
    let pdfDoc=new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream(repoFile));
    pdfDoc.text(text);   
    pdfDoc.end();
    fs.writeFileSync(repoFile,JSON.stringify(arr));

}


}
module.exports={
    fxn:getIssue
}