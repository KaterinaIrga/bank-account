create table base (
  id numeric primary key not null,
  fBalance float default 0
);

create sequence base_id increment by 100 start 100;

insert into base values (nextval('base_id'), (22));
insert into base (id) values (nextval('base_id'));
insert into base values (nextval('base_id'), (10));


  create or replace function setBalance(pIdTo numeric, 
							 pfValue float, 
							 psType varchar(5), 
							 pIdFrom numeric default null) 
	returns void 
	language plpgsql as $body$
	declare
	  vfValue float;
	begin 
	  if (psType = 'add') then
	    vfValue := pfValue;
	  else
	    vfValue := -pfValue;
	  end if;
	  
	  begin
	    update base
	      set fBalance = fBalance + vfValue
		  where id = pIdTo;
		
	    --Если переводили средства от пользователя - списываем у него	
	    if pIdFrom is not null then	
	      update base
	    	set fBalance = fBalance - vfValue
	  	    where id = pIdFrom;
	    end if;
	  
	  end;
	  --commit;
	end ;
$body$;

  create or replace function getBalance(pid numeric) 
  returns float
  language plpgsql as $body$
	declare
	  vfBalance numeric;
	begin
	  select fBalance 
	    into vfBalance
	    from base 
	    where id = pId;
	  return vfBalance;
	end;
	$body$;
