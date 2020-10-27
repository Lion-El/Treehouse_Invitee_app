function supportsLocalStorage() {
  try {
  return 'localStorge' in window && window['localStorage'] !== null;
  } catch(e)  {
    return false;
  }
}

function getAllAttendees() {
  let attendees = localStorage.getItem('recentSearches');
  if (attendees) {
    return JSON.parse(attendees);
  } else{
    return [];
  }
}

function addItemtoLocalStorage(ulChild) {
  let attendees = getAllAttendees();
  attendees.push(ulChild);
  console.log(attendees);
  localStorage.setItem('recentSearches', JSON.stringify(attendees));
}

document.addEventListener('DOMContentLoaded', () => {
  if (supportsLocalStorage) {
    const form = document.getElementById('registrar');
    const input = form.querySelector('input');
    
    const mainDiv = document.querySelector('.main');
    const ul = document.getElementById('invitedList');
    
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');
    
    filterLabel.textContent = "Show confirmed attendees only";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);

  let attendees = getAllAttendees();
    if (attendees)  {
      for (let i = 0; i < attendees.length; i++)  {
        ul.appendChild(createLI(attendees[i]));
      }
    }

    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const lis = ul.children;

      if(isChecked) {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          let notComing = document.querySelector(`.not_coming_${i}`).firstElementChild;
          let response = document.querySelector(`.response_${i}`).firstElementChild;
          let confirmed = document.querySelector(`.confirmation_${i}`).firstElementChild;
          if (notComing.checked || response.checked) {
            li.style.display = 'none';  
          } else if (confirmed.checked) {
            confirmed.style.display = 'none';  
          } else {
            li.style.display = '';
            confirmed.style.display = '';
          }
        }
      } else {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          li.style.display = '';
        }                                 
      }
    });
    
    function createLI(text) {

      function classGroup(className) {
        let li = ul.children.length;
        let classGroup = `${className}_${li}`;
        return classGroup;
      }

      function buttonGroup() {
        let li = ul.children.length;
        let buttonGroup = `selection ${li}`;
        return buttonGroup;
      }
      
      function createElement(elementName, property, value, 
        attributeName1, nameValue1, attributeName2, nameValue2) {
        const element = document.createElement(elementName);  
        element[property] = value;
        element.setAttribute(attributeName1, nameValue1);
        element.setAttribute(attributeName2, nameValue2);
        return element;
      }
      
      function appendToLI(elementName, property, value, attribute, className) {
        const element = createElement(elementName, property, value);
        element.setAttribute(attribute, className);   
        li.appendChild(element); 
        return element;
      }
      
      const li = document.createElement('li');
      appendToLI('span', 'textContent', text);     
      appendToLI('label', 'textContent', 'Confirm', 'class', classGroup('confirmation'))
        .appendChild(createElement('input', 'type', 'radio',
        'name', buttonGroup() , 'value', 'confirm' ));
      appendToLI('label', 'textContent', 'Awaiting Response', 'class', classGroup('response'))
        .appendChild(createElement('input', 'type', 'radio',
        'name',buttonGroup(), 'value', 'response'));
      appendToLI('label', 'textContent', 'Not Coming', 'class', classGroup('not_coming'))
        .appendChild(createElement('input', 'type', 'radio',
        'name',buttonGroup(), 'value', 'not coming'));
      appendToLI('button', 'textContent', 'edit');
      appendToLI('button', 'textContent', 'remove');
      appendToLI('textarea', 'placeholder', 'Attandee notes...', 'class', '');
      return li;
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value;
      let duplicate;
      const noStringError = 'ERROR, Please add attendee name';
      const duplicateError = 'ERROR, This is a duplicate';

      function appendLi() {
        input.value = '';
        const li = createLI(text);
        ul.appendChild(li);
        addItemtoLocalStorage(text);
      }

      function checkForDuplicate() {
        li = ul.children;
        for (let i = 0; i < li.length; i++)  {
          if (text === li[i].firstElementChild.textContent) {
            duplicate = text;
          }
        }
      }

      function inputValueError()  {
        input.style.color = 'red';
        input.value = noStringError;
      }

      function inputDuplicateError() {
        input.style.color = 'red';
        input.value = duplicateError; 
      }

      if (text.length === 0 || text === noStringError || text === duplicateError)  {
        inputValueError();
      } else if (text.length > 0 && ul.children.length === 0) {
        appendLi();
      } else if (text.length > 0 && ul.children.length > 0)  {
        checkForDuplicate();
        if (duplicate) {
          inputDuplicateError();
        } else  {
          appendLi();
        }
      } 
              
    });

    input.addEventListener('click', (e) => {
      input.value = '';
      input.style.color = '#4c4c4c';
    });

    input.addEventListener('focus', (e) => {
      input.value = '';
      input.style.color = '#4c4c4c';
    });
      
    ul.addEventListener('change', (e) => {
      const radioButton = e.target;
      const li = radioButton.parentNode.parentNode;
      let label = radioButton.parentNode;
      let className = label.className;
      let i = className[className.length - 1];
      let confirmationLabel = document.querySelector(`.confirmation_${i}`);
      let responseLabel = document.querySelector(`.response_${i}`);
      let notComingLabel = document.querySelector(`.not_coming_${i}`);

      function confirmedStyling() {
        radioButton.style.display = '';
        li.className = 'responded';
        label.firstChild.textContent = 'Confirmed';
        label.style.color = 'rgba(88, 183, 205, 1)';
        responseLabel.style.color = '#707070';
        notComingLabel.style.color = '#707070';
      }

      function hideListElement()  {
        label.style.color = 'rgba(88, 183, 205, 1)';
        confirmationLabel.firstChild.textContent = 'Confirm';
        confirmationLabel.firstElementChild.style.display = '';
        confirmationLabel.style.color = '#707070';
        li.style.display = 'none'; 
      }

      function showListElement()  {
        li.style.display = '';
        li.className = '';
        label.style.color = 'rgba(88, 183, 205, 1)';
        confirmationLabel.firstChild.textContent = 'Confirm';
        confirmationLabel.firstElementChild.style.display = '';
        confirmationLabel.style.color = '#707070';
      }
      
      if(radioButton.value === 'confirm')  {
        if (filterCheckBox.checked) {
          radioButton.style.display = 'none';  
        } else {
          confirmedStyling();
        }                           
      } else  if (radioButton.value === 'response')  {
        if (filterCheckBox.checked) {
          hideListElement();
        } else {
          showListElement();
          notComingLabel.style.color = '#707070';                       
        }    
      } else  if (radioButton.value === 'not coming')  {
        if (filterCheckBox.checked) {
          hideListElement();
        } else {
          showListElement();
          responseLabel.style.color = '#707070';                       
        }
      }
    });

    ul.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const action = button.textContent;
        const nameActions = {
          remove: () => {
            ul.removeChild(li);
          },
          edit: () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            button.textContent = 'save';  
          },
          save: () => {
            const input = li.firstElementChild;
            const span = document.createElement('span');
            span.textContent = input.value;
            li.insertBefore(span, input);
            li.removeChild(input);
            button.textContent = 'edit';        
          }
        };
        
        // select and run action in button's name
        nameActions[action]();
      }
    });
    
    ul.addEventListener('focusin', (e) => {
      const textArea = e.target;
      textArea.style.outline = 'none';
      textArea.className = 'textFocus';
    });
    
    ul.addEventListener('focusout', (e) => {
      const textArea = e.target;
      textArea.className = '';
    });
  }
});  
  
  
  
  
  
  
  
  
  