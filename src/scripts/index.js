import {isValid} from './utils';
let Pool1 = require('pg');

var client = Pool1.createConnection({
  host: "localhost",
  user: "postgres",
  password: "z",
  database: "postgres"
});

const SQL = []
SQL.push('create table base ( ',
  'id numeric primary key not null,',
  'fBalance float default 0',
');',

'create sequence base_id increment by 100 start 100;',

'insert into base values (nextval(\'base_id\'), (22));',
'insert into base (id) values (nextval(\'base_id\'));',
'insert into base values (nextval(\'base_id\'), (10));',
'',
'create or replace function setBalance(pIdTo numeric, ',
                                      'pfValue float,', 
                                      'psType varchar(5),',
                                      'pIdFrom numeric default null) ',
	'returns void ',
	'language plpgsql as $body$ ',
	'declare',
	  'vfValue float;',
	'begin ',
	  'if (psType = \'add\') then',
	    'vfValue := pfValue;',
	  'else',
	    'vfValue := -pfValue;',
	  'end if;',
	  '',
	  'begin',
	    'update base',
	      'set fBalance = fBalance + vfValue',
		  'where id = pIdTo;',
		'',
	    'if pIdFrom is not null then	',
	      'update base',
	    	'set fBalance = fBalance - vfValue',
	  	    'where id = pIdFrom;',
	    'end if;',
	  '',
	  'end;',
	  '--commit;',
	'end ;',
'$body$;',
'',
  'create or replace function getBalance(pid numeric) ',
  'returns float',
  'language plpgsql as $body$',
	'declare',
	  'vfBalance numeric;',
	'begin',
	  'select fBalance ',
	    'into vfBalance',
	    'from base ',
	    'where id = pId;',
	  'return vfBalance;',
	'end;',
	'$body$;');

const setValue = async (pIdTo, pfValue, psType, pIdFrom) => {
  try {
      await client.connect();                                      
      const { rows } = await client.query('SELECT setBalance('||pIdTo||', '||pfValue||', '||psType||', '||pIdFrom||')'); // sends queries
      console.log(rows);
  } catch (error) {
      console.error(error.stack);
  } finally {
      await client.end();                                          
  }
};

const getValue = async (pIdTo) => {
  try {
      await client.connect();                                      
      const { rows } = await client.query('SELECT getBalance('||pIdTo||')'); // sends queries
      console.log(rows);
  } catch (error) {
      console.error(error.stack);
  } finally {
      await client.end();                                          
  }
};

async function initBase(SQL) {
  try {
      console.log('init base');
      await client.connect();                                      
      const { rows } = await client.query(SQL); // sends queries
      console.log(rows);
  } catch (error) {
      console.error(error.stack);
  } finally {
      await client.end();                                          
  }
};

const form = document.getElementById('form');
const btn_add = form.querySelector('#add').addEventListener('click', add);
const btn_reduce = form.querySelector('#reduce').addEventListener('click', reduce);
const btn_transfer = form.querySelector('#transfer').addEventListener('click', transfer);
const btn_show = form.querySelector('#show').addEventListener('click', show);

btn_add.addEventListener("click", () => { dialog.showModal();});
btn_reduce.addEventListener("click", () => { dialog.showModal();});
btn_transfer.addEventListener("click", () => { dialog.showModal();});
btn_show.addEventListener("click", () => { dialog.showModal();});

initBase (SQL) ;

function serializeForm(formNode) {
  const { elements } = formNode;

  Array.from(elements)
    .forEach((element) => {
      const { name, value } = element
      if (element.name != '') {
        console.log(element);
        console.log(JSON.stringify(element.name, element.value));
      }
    })
}

function add(event) {
  console.log('add!');
  preventDefault();
  serializeForm(form);
  const inputTo = form.querySelector('#idTo-input').value;
  const inputSumm = form.querySelector('#summ-input').value;
  const inputFrom = form.querySelector('#idFrom-input').value;
  const dialog__value = document.getElementById('dialog__value');

  if (isValid(inputTo)) {
    setValue(inputTo, inputSumm, 'add', inputFrom).then((data)=> {
      console.log(data); 
      dialog__value.value = data;
      document.getElementById("balance"+inputTo).value = data; 
    })
  }

  document.getElementById("add").disabled = true; 
  document.getElementById("idTo-input").disabled = true; 
  document.getElementById("summ-input").disabled = true; 
  
  inputTo = '';
  inputSumm = '';

  document.getElementById("add").disabled = false; 
  document.getElementById("idTo-input").disabled = false; 
  document.getElementById("summ-input").disabled = false;   

  
}

function reduce(event) {
  console.log('reduce!');
  preventDefault();
  serializeForm(form);
  const inputTo = form.querySelector('#idTo-input').value;
  const inputSumm = form.querySelector('#summ-input').value;
  const inputFrom = form.querySelector('#idFrom-input').value;

  if (isValid(inputTo)) {
    setValue(inputTo, inputSumm, 'red', inputFrom).then((data)=> {
      console.log(data);
      dialog__value.value = data;
      document.getElementById("balance"+inputTo).value = data;
    })
  }

  document.getElementById("reduce").disabled = true; 
  document.getElementById("idTo-input").disabled = true; 
  document.getElementById("summ-input").disabled = true; 
  
  inputTo = '';
  inputSumm = '';

  document.getElementById("reduce").disabled = false; 
  document.getElementById("idTo-input").disabled = false; 
  document.getElementById("summ-input").disabled = false;

}

function transfer() {
  console.log('transfer!');
  serializeForm(form);
  const inputTo = form.querySelector('#idTo-input').value;
  const inputSumm = form.querySelector('#summ-input').value;
  const inputFrom = form.querySelector('#idFrom-input').value;

  if ((isValid(inputTo)) & (isValid(inputFrom))) {
    setValue(inputTo, inputSumm, 'add', inputFrom).then((data)=> {
      console.log(data);
      dialog__value.value = data;
      document.getElementById("balance"+inputTo).value = data;
      document.getElementById("balance"+inputFrom).value = data;
    })
  }
  document.getElementById("add").disabled = true; 
  document.getElementById("idTo-input").disabled = true; 
  document.getElementById("summ-input").disabled = true; 
  document.getElementById("idFrom-input").disabled = true; 
  
  inputTo = '';
  inputSumm = '';
  inputFrom = '';

  document.getElementById("add").disabled = false; 
  document.getElementById("idTo-input").disabled = false; 
  document.getElementById("summ-input").disabled = false; 
  document.getElementById("idFrom-input").disabled = false; 

}

function show() {
  console.log('show!');
  preventDefault();
  serializeForm(form);
  const inputTo = form.querySelector('#idTo-input').value;
  const inputSumm = form.querySelector('#summ-input').value;
  const inputFrom = form.querySelector('#idFrom-input').value;

  if (isValid(inputTo))  {
    getValue(inputTo).then((data)=> {
      console.log(data);
      dialog__value.value = data;
    })
  }

  inputTo = '';
}