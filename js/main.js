$(document).ready(function() {


  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const submitName = document.getElementById('submitName');
  const chambers = document.getElementById('chambers');
  const season = document.getElementById('season');
  const activeBillHtml = document.getElementById('activeBill');
  const introBillHtml =  document.getElementById('introBill');
  const main = document.getElementById('main');
  let offSetNum = 0;
  let offSet = '?offset=' + offSetNum;
  let nextNum = 0;
  const nextBtn = document.getElementById('next');
  // const billDisplay;
  // const voteDisplay;
  let setHeader = (xhr) => {
    xhr.setRequestHeader('X-API-Key', 'VYpnKNVvY5sdEXmyRoxK7VLSJkB8C839hSPtl8pA');
  };
  const xhr = new XMLHttpRequest();

  nextBtn.addEventListener('click', ()=>{
    offSetNum += 20;
    offSet = '?offset=' + offSetNum;
    activeBill();
    introBill();
  })


  let onLoadHtml = (data, html) =>{
    let res = data.results[0].bills;
    for(let i = 0; i < res.length; i += 1){
      html.innerHTML += '<div class="on-load"><header><h5>' + res[i].number +
      '</h5></br>' + res[i].sponsor_title  +
      ' ' + res[i].sponsor_name  +
      '</br>Cosponsers: ' + res[i].cosponsors  +
      '</header><section>' + res[i].short_title.substring(0, 180)  +
      '<a href="' + res[i].congressdotgov_url  +
      '/text" target="_blank"> read text</a><h6> last major action</h6>' + res[i].latest_major_action.substring(0, 100)
      + '</section></div>';
    }
  }

  let activeBill = () =>{
    $.ajax({
      url: 'https://api.propublica.org/congress/v1/115/both/bills/active.json' + offSet,
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader,
      success: (data) =>{
        onLoadHtml(data, activeBillHtml);
      },
      error: function() { alert('somthing went wrong2'); }
    });
  };

  let introBill = () =>{
    $.ajax({
      url: 'https://api.propublica.org/congress/v1/115/both/bills/introduced.json' + offSet,
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader,
      success: (data) =>{
        onLoadHtml(data, introBillHtml);
      },
      error: function() { alert('somthing went wrong'); }
    });
  };
  let init = () =>{
    firstNameInput.value = '';
    lastNameInput.value = '';
  };

  window.onload = function(){
    for(let i = 102; i < 116; i += 1){
      season.innerHTML += '<option value="' + i + '">' + i + '</option>';
    }
    init();
    activeBill();
    introBill();
  };
  setInterval(introBill(), 900000);
  setInterval(activeBill(), 900000);
  chambers.addEventListener('change', function(){
    season.innerHTML = ' ';
    if($('nav select#chambers option:checked').val() == 'senate'){
      for(let i = 80; i < 116; i += 1){
        season.innerHTML += '<option value="' + i + '">' + i + '</option>';
      }
    }else{
      for(let i = 102; i < 116; i += 1){
        season.innerHTML += '<option value="' + i + '">' + i + '</option>';
      }
    }
  });


  submitName.addEventListener('click', function(){
    let membersID = [];
    let seasonPickerValue = $('select#season option:checked').val();
    let chamberPickerValue = $('select#chambers option:checked').val();
    let firstNameValue = firstNameInput.value;
    let lastNameValue = lastNameInput.value;
    $.ajax({
      url: 'https://api.propublica.org/congress/v1/' + seasonPickerValue + '/'+ chamberPickerValue +'/members.json',
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader,
      success: (data) => {
        let res = data.results[0].members;
        lastNameValue = lastNameValue.toLowerCase()
        firstNameValue = firstNameValue.toLowerCase();
        for(let i = 0; i < res.length; i += 1){
          if(res[i].last_name.toLowerCase() == lastNameValue || res[i].first_name.toLowerCase() == firstNameValue){
            let index = membersID.indexOf(res[i].id)
            if(index == -1){
              membersID.push(res[i].id);
            }
          }
        }
        if(membersID.length === 0){
          alert('no matches');
        } else{
          main.innerHTML = '';
          main.classList.remove('mainOnLoad');
          main.classList.add('mainRes');
          billResults(membersID);
          init();
        }
      },
      error: function() { alert('something broke'); }
    });
  });

  // get json for bills based off of member ID from members.json
  let billResults = (membersID) => {
    for(let i = 0; i < membersID.length; i += 1){
      let member = membersID[i];
      $.ajax({
        url: 'https://api.propublica.org/congress/v1/members/'+ member +'/bills/introduced.json',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader,
        success: (data) =>{
          let res = data.results[0];
          let bill = res.bills;
          if(membersID.length == 1){
            main.innerHTML = '<header class="resultHeader"><h3>' + res.bills[i].sponsor_title + ' ' + data.results[0].name + '</h3><header>';
            for(let i = 0; i < bill.length; i += 1){
              main.innerHTML += '<section><header><h5>' + res.bills[i].number +
              '</h5></br>Cosponsers: ' + res.bills[i].cosponsors  +
              '</header><section>' + res.bills[i].short_title  +
              '<a href="' + res.bills[i].congressdotgov_url  +
              '"> read text</a><h6> last major action</h6>' + res.bills[i].latest_major_action
              + '</section></section>';

            }
            main.innerHTML += ' <button class="next" value="' + member + '">Next 20</button>'
          }else{
            main.innerHTML += '<header class="resultHeader" id="' + member + '"><h3>' + res.bills[i].sponsor_title + ' ' + data.results[0].name + '</h3><button class="show" value="'+ member +'">show bills introduced</button></header>';
            }
        },
        error: function() { alert('somthing is wrong'); }
      });
    }
  };
  $(document).on('click', '.show', function(){
    let setHeader = (xhr) => {
      xhr.setRequestHeader('X-API-Key', 'VYpnKNVvY5sdEXmyRoxK7VLSJkB8C839hSPtl8pA');
    };
    const xhr = new XMLHttpRequest();
    let member = $(this).val();
    $('main').empty();
    $.ajax({
      url: 'https://api.propublica.org/congress/v1/members/'+ member +'/bills/introduced.json',
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader,
      success: (data) =>{
        let res = data.results[0];
        let bill = res.bills;
        main.innerHTML = '<header class="resultHeader"><h3>' + data.results[0].bills[0].sponsor_title + ' ' + data.results[0].name + '</h3><header>';
        for(let i = 0; i < bill.length; i += 1){
          main.innerHTML += '<section><header><h5>' + res.bills[i].number +
          '</h5></br>Cosponsers: ' + res.bills[i].cosponsors  +
          '</header><section>' + res.bills[i].short_title  +
          '<a href="' + res.bills[i].congressdotgov_url  +
          '"> read text</a><h6> last major action</h6>' + res.bills[i].latest_major_action
          + '</section></section>';
        }
        main.innerHTML += ' <button class="next" value="' + member + '">Next 20</button>'
      }
      ,
      error: function() { alert('somthing is wrong'); }
    });

  });
  $(document).on('click', '.next', function() {
    let setHeader = (xhr) => {
      xhr.setRequestHeader('X-API-Key', 'VYpnKNVvY5sdEXmyRoxK7VLSJkB8C839hSPtl8pA');
    };
    const xhr = new XMLHttpRequest();
    let member =  $(this).val();
    nextNum += 20;
    let nextSet = '?offset=' + nextNum
    $('.next').remove();
    $.ajax({
      url: 'https://api.propublica.org/congress/v1/members/'+ member +'/bills/introduced.json' + nextSet,
      type: 'GET',
      dataType: 'json',
      beforeSend: setHeader,
      success: (data) =>{
        let res = data.results[0];
        let bill = res.bills;
        for(let i = 0; i < bill.length; i += 1){
          main.innerHTML += '<section><header><h5>' + res.bills[i].number +
          '</h5></br>Cosponsers: ' + res.bills[i].cosponsors  +
          '</header><section>' + res.bills[i].short_title  +
          '<a href="' + res.bills[i].congressdotgov_url  +
          '"> read text</a><h6> last major action</h6>' + res.bills[i].latest_major_action
          + '</section></section>';
        }
        main.innerHTML += ' <button class="next" value="' + member + '">Next 20</button>'
      }
      ,
      error: function() { alert('somthing is wrong'); }
    });
  });
});
