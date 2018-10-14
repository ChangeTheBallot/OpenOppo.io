$(document).ready(function() {


  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const submitName = document.getElementById('submitName');
  const chambers = document.getElementById('chambers');
  const season = document.getElementById('season');
  // const billDisplay;
  // const voteDisplay;
  let setHeader = (xhr) => {
    xhr.setRequestHeader('X-API-Key', 'VYpnKNVvY5sdEXmyRoxK7VLSJkB8C839hSPtl8pA');
  }
  const xhr = new XMLHttpRequest();
  chambers.onload = function(){
    for(let i = 80; i < 116; i += 1){
       season.innerHTML = '<option value="' + i + '">' + i + '</option>';
    }
  };
  window.onload = function(){
    for(let i = 102; i < 116; i += 1){
       season.innerHTML += '<option value="' + i + '">' + i + '</option>';
    }
  };


  chambers.addEventListener('change', function(){
    season.innerHTML = ' ';
    if($('select#chambers option:checked').val() == 'senate'){
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
    const membersID = [];
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
        for(let i = 0; i < res.length; i += 1){
          if(res[i].last_name == lastNameValue || res[i].first_name == firstNameValue){
            let index = membersID.indexOf(res[i].id)
            if(index == -1){
              membersID.push(res[i].id);
            }
          }
        }
        if(membersID.length === 0){
          alert('no returns');
        } else{
          billResults(membersID);
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
          console.log(data);
        },
        error: function() { alert('somthing is wrong'); }
      });
    }
  };
  // get json for votes based off of member ID from members.json
  // let voteResults = () =>{
  //
  // };

});