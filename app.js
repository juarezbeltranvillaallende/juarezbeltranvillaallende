
var APP = (function() {

var TIPO=null, MODO='nuevo', GEN={loc:'m',loc2:'m'}, GARS=[], GC=0, CLO={}, CLE={}, LOCS=[], LC=0;
var MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var MESU=MES.map(function(m){return m.toUpperCase();});
var OBL=['dir','barrio','ciudad','dgr','loc-n','loc-d','loc2-n','loc2-d','fi','alq'];

function v(id){var e=document.getElementById(id);return e?e.value.trim():'';}
function hdn(id,hide){var e=document.getElementById(id);if(e)e.classList.toggle('hdn',hide);}

function E(s){
  var r=String(s||'');
  r=r.split('&').join('&amp;');
  r=r.split('<').join('&lt;');
  r=r.split('>').join('&gt;');
  return r;
}

function fL(val){
  if(!val)return 'XX de XXXX de XXXX';
  var d=new Date(val+'T00:00:00');
  return d.getDate()+' de '+MES[d.getMonth()]+' de '+d.getFullYear();
}
function fLU(val){
  if(!val)return 'XX de XXXX de XXXX';
  var d=new Date(val+'T00:00:00');
  return String(d.getDate()).padStart(2,'0')+' de '+MESU[d.getMonth()]+' de '+d.getFullYear();
}
function fSl(val){
  if(!val)return 'XX/XX/XXXX';
  var d=new Date(val+'T00:00:00');
  return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
}
function fFirma(val){
  var NS=['','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE','DIEZ','ONCE',
    'DOCE','TRECE','CATORCE','QUINCE','DIECISEIS','DIECISIETE','DIECIOCHO','DIECINUEVE','VEINTE',
    'VEINTIUNO','VEINTIDOS','VEINTITRES','VEINTICUATRO','VEINTICINCO','VEINTISEIS',
    'VEINTISIETE','VEINTIOCHO','VEINTINUEVE','TREINTA','TREINTA Y UNO'];
  if(!val)return '_________ (XX) dias del mes de ________________ del año 2.0XX';
  var d=new Date(val+'T00:00:00');
  var dia=d.getDate();
  var mes=MES[d.getMonth()]; mes=mes.charAt(0).toUpperCase()+mes.slice(1);
  return (NS[dia]||String(dia))+' ('+String(dia).padStart(2,'0')+') dias del mes de '+mes+' del año '+d.getFullYear();
}

function gT(pref){
  var gen;
  if(pref==='loc') gen=GEN.loc;
  else if(pref==='loc2') gen=GEN.loc2;
  else {
    var found=null;
    for(var i=0;i<GARS.length;i++){if(GARS[i].id===pref){found=GARS[i];break;}}
    gen=found?found.gen:'m';
  }
  if(gen==='m') return {sr:'Sr',el:'el',nac:'argentino',nacido:'nacido'};
  return {sr:'Sra',el:'la',nac:'argentina',nacido:'nacida'};
}

function showPg(id,btn){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
  document.getElementById('pg-'+id).classList.add('on');
  var navBtns=document.querySelectorAll('.bar-nav .nb');
  navBtns.forEach(function(b){b.classList.remove('on');});
  if(btn) btn.classList.add('on');
  if(id==='hs') renderH();
}

function setModo(m){
  MODO=m;
  var r=(m==='renov');
  document.getElementById('bn-nv').classList.toggle('on',!r);
  document.getElementById('bn-rv').classList.toggle('on',r);
  document.body.classList.toggle('rv',r);
  if(TIPO) hdn('pnl-rv',!r);
  if(!r){
    CLO={}; CLE={};
    hdn('pnl-cls',true);
    var ta=document.getElementById('txt-ant'); if(ta) ta.value='';
    var st=document.getElementById('st-ant'); if(st) st.innerHTML='';
    document.querySelectorAll('[data-pre]').forEach(function(e){
      e.style.background=''; e.removeAttribute('data-pre');
    });
  }
}

function selT(btn){
  document.querySelectorAll('.tb').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  TIPO=btn.dataset.t;
  hdn('fb',false);
  var L=TIPO==='local', D=(TIPO==='depto'||TIPO==='estrenar'), C=TIPO==='country', SE=TIPO==='estrenar';
  hdn('fd-sup',!L); hdn('fd-cntry',!C); hdn('fd-coch',!SE); hdn('fd-cons',!D);
  hdn('fd-dest',!L); hdn('fd-masc',!D);
  var bt=document.getElementById('btipo');
  bt.textContent=btn.querySelector('span').textContent; bt.style.display='inline-flex';
  if(MODO==='renov') hdn('pnl-rv',false);
  chg();
  if(GARS.length===0) addG();
}

function setG(pref,btn){
  btn.closest('.gbtn').querySelectorAll('.gb').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  var gen=btn.dataset.g;
  if(pref==='loc'){
    GEN.loc=gen;
    var e=document.getElementById('loc-nac'); if(e) e.value=(gen==='m'?'argentino':'argentina');
  } else if(pref==='loc2'){
    GEN.loc2=gen;
    var e2=document.getElementById('loc2-nac'); if(e2) e2.value=(gen==='m'?'argentino':'argentina');
  } else {
    for(var i=0;i<LOCS.length;i++){if(LOCS[i].id===pref){LOCS[i].gen=gen;break;}}
    for(var i=0;i<GARS.length;i++){if(GARS[i].id===pref){GARS[i].gen=gen;break;}}
    var ne=document.getElementById(pref+'-nac'); if(ne) ne.value=(gen==='m'?'argentino':'argentina');
  }
}


function addLoc(){
  LC++; var id='loc'+LC;
  LOCS.push({id:id,gen:'m'});
  renderLocs();
}

function remLoc(id){
  var nl=[];
  for(var i=0;i<LOCS.length;i++){if(LOCS[i].id!==id) nl.push(LOCS[i]);}
  LOCS=nl;
  renderLocs();
}

function renderLocs(){
  var cont=document.getElementById('locs-cont');
  if(!cont) return;
  while(cont.firstChild) cont.removeChild(cont.firstChild);
  for(var i=0;i<LOCS.length;i++){
    (function(loc,num){
      var id=loc.id;
      var blq=document.createElement('div');
      blq.className='gb-blq';
      var tit=document.createElement('div');
      tit.className='gb-tit';
      tit.textContent='Co-Locatario '+(num+1);
      blq.appendChild(tit);
      var remBtn=document.createElement('button');
      remBtn.className='btn btnd';
      remBtn.style.cssText='position:absolute;top:9px;right:9px;font-size:11px;padding:3px 8px';
      remBtn.textContent='Quitar';
      (function(gid){remBtn.onclick=function(){APP.remLoc(gid);};})(id);
      blq.appendChild(remBtn);
      var r1=document.createElement('div'); r1.className='g4'; r1.style.marginBottom='8px';
      r1.innerHTML=
        '<div class="f"><label>Genero</label><div class="gbtn">'+
        '<button class="gb on" data-g="m" onclick="APP.setG(&quot;'+id+'&quot;,this)">Hombre</button>'+
        '<button class="gb" data-g="f" onclick="APP.setG(&quot;'+id+'&quot;,this)">Mujer</button>'+
        '</div></div>'+
        '<div class="f"><label>Nombre y apellido</label><input id="'+id+'-n" type="text"></div>'+
        '<div class="f"><label>DNI</label><input id="'+id+'-d" type="text"></div>'+
        '<div class="f"><label>Nacionalidad</label><input id="'+id+'-nac" type="text" value="argentino"></div>';
      blq.appendChild(r1);
      var r2=document.createElement('div'); r2.className='g4';
      r2.innerHTML=
        '<div class="f"><label>Fecha nacimiento</label><input id="'+id+'-fn" type="date"></div>'+
        '<div class="f"><label>Domicilio</label><input id="'+id+'-dom" type="text"></div>'+
        '<div class="f"><label>Barrio</label><input id="'+id+'-barrio" type="text"></div>'+
        '<div class="f"><label>Ciudad</label><input id="'+id+'-ciudad" type="text"></div>';
      blq.appendChild(r2);
      cont.appendChild(blq);
    })(LOCS[i],i);
  }
}

function locsExtra(){
  if(LOCS.length===0) return '';
  var txt='';
  for(var i=0;i<LOCS.length;i++){
    var lG=gT(LOCS[i].id);
    txt+='; y '+lG.el+'/la '+lG.sr+'/Sra. '+(v(LOCS[i].id+'-n')||'XXXXXXXXXX')+', DNI: '+(v(LOCS[i].id+'-d')||'XXXXXXXX')+', '+(v(LOCS[i].id+'-nac')||'argentino')+', mayor de edad, '+lG.nacido+' el '+fL(v(LOCS[i].id+'-fn'));
  }
  return txt;
}

function addG(){
  GC++; var id='g'+GC;
  GARS.push({id:id,gen:'m'});
  renderGars();
}

function remG(id){
  var newGars=[];
  for(var i=0;i<GARS.length;i++){if(GARS[i].id!==id) newGars.push(GARS[i]);}
  GARS=newGars;
  renderGars();
}

function renderGars(){
  var cont=document.getElementById('gar-cont');
  if(!cont) return;
  while(cont.firstChild) cont.removeChild(cont.firstChild);

  for(var i=0;i<GARS.length;i++){
    var gar=GARS[i]; var id=gar.id; var num=i+1;
    var blq=document.createElement('div');
    blq.className='gb-blq';

    var tit=document.createElement('div');
    tit.className='gb-tit';
    tit.textContent='Garante '+num;
    blq.appendChild(tit);

    if(GARS.length>1){
      var remBtn=document.createElement('button');
      remBtn.className='btn btnd';
      remBtn.style.cssText='position:absolute;top:9px;right:9px;font-size:11px;padding:3px 8px';
      remBtn.textContent='Quitar';
      (function(gid){remBtn.onclick=function(){APP.remG(gid);};})(id);
      blq.appendChild(remBtn);
    }

    // Row 1: genero, nombre, dni, fecha
    var r1=document.createElement('div'); r1.className='g4'; r1.style.marginBottom='8px';
    r1.innerHTML=
      '<div class="f"><label>Genero</label><div class="gbtn">'+
      '<button class="gb '+(gar.gen==='m'?'on':'')+'" data-g="m" onclick=\"APP.setG(&quot;'+id+'&quot;,this)\">Hombre</button>'+
      '<button class="gb '+(gar.gen==='f'?'on':'')+'" data-g="f" onclick=\"APP.setG(&quot;'+id+'&quot;,this)\">Mujer</button>'+
      '</div></div>'+
      '<div class="f"><label>Nombre y apellido</label><input id="'+id+'-n" type="text"></div>'+
      '<div class="f"><label>DNI</label><input id="'+id+'-d" type="text"></div>'+
      '<div class="f"><label>Fecha nacimiento</label><input id="'+id+'-fn" type="date"></div>';
    blq.appendChild(r1);

    // Row 2: dom, barrio, ciudad
    var r2=document.createElement('div'); r2.className='g3'; r2.style.marginBottom='8px';
    r2.innerHTML=
      '<div class="f"><label>Domicilio</label><input id="'+id+'-dom" type="text"></div>'+
      '<div class="f"><label>Barrio</label><input id="'+id+'-barrio" type="text"></div>'+
      '<div class="f"><label>Ciudad/Provincia</label><input id="'+id+'-ciudad" type="text"></div>';
    blq.appendChild(r2);

    // Row 3: tipo garantia
    var r3=document.createElement('div'); r3.className='g2'; r3.style.marginBottom='8px';
    r3.innerHTML=
      '<div class="f"><label>Tipo de garantia</label>'+
      '<select id="'+id+'-tipo" onchange="APP.onTG(&quot;'+id+'&quot;)">'+
      '<option value="inmueble">Inmueble (matricula)</option>'+
      '<option value="haberes">Haberes / jubilacion</option>'+
      '<option value="ambos">Inmueble + haberes</option>'+
      '</select></div>'+
      '<div class="f" id="'+id+'-mf"><label>Matricula N</label><input id="'+id+'-mat" type="text" placeholder="Ej: 123456"></div>';
    blq.appendChild(r3);

    // Row 4: descripcion inmueble
    var r4=document.createElement('div'); r4.className='f'; r4.style.marginBottom='8px';
    r4.id=id+'-df';
    r4.innerHTML='<label>Descripcion del inmueble (encabezado matricula)</label><input id="'+id+'-desc" type="text" placeholder="Casa sita en calle...">';
    blq.appendChild(r4);

    // Row 5: haberes (hidden)
    var r5=document.createElement('div'); r5.className='g2 hdn'; r5.style.marginBottom='8px';
    r5.id=id+'-hf';
    r5.innerHTML=
      '<div class="f"><label>Organismo</label><input id="'+id+'-org" type="text" placeholder="Ej: ANSES"></div>'+
      '<div class="f"><label>CUIT organismo</label><input id="'+id+'-cuit" type="text"></div>';
    blq.appendChild(r5);

    // Row 6: conyuge
    var r6=document.createElement('div'); r6.className='g2';
    r6.innerHTML=
      '<div class="f"><label>Conyuge (si casado/a)</label><input id="'+id+'-cony" type="text" placeholder="Dejar vacio si no aplica"></div>'+
      '<div class="f"><label>DNI conyuge</label><input id="'+id+'-conyd" type="text"></div>';
    blq.appendChild(r6);

    cont.appendChild(blq);
  }
}

function onTG(id){
  var vt=v(id+'-tipo');
  hdn(id+'-mf',vt==='haberes');
  hdn(id+'-df',vt==='haberes');
  hdn(id+'-hf',vt==='inmueble');
}

function gTxt(id){
  var vt=v(id+'-tipo')||'inmueble';
  var mat=v(id+'-mat')||'XXXXXX';
  var desc=v(id+'-desc')||'(descripcion del encabezado de la matricula)';
  var org=v(id+'-org')||'XXX';
  var cui=v(id+'-cuit')||'XXXXXXXX';
  if(vt==='inmueble') return 'presenta como garantia su propiedad sobre un inmueble inscripto ante el Registro General de la Provincia a la Matricula '+mat+' Capital (XX) descripto como: '+desc;
  if(vt==='haberes') return 'presenta como garantia sus haberes otorgados por '+org+', CUIT:'+cui;
  return 'presenta como garantia su propiedad inscripta a la Matricula '+mat+' Capital (XX) descripto como: '+desc+', y sus haberes otorgados por '+org+', CUIT:'+cui;
}

function togCb(lbl){
  setTimeout(function(){
    var cb=lbl.querySelector('input[type=checkbox]');
    lbl.classList.toggle('on',cb.checked);
  },0);
}
function togAll(s){
  document.querySelectorAll('#inst-grid input[type=checkbox]').forEach(function(cb){
    cb.checked=s; cb.closest('label').classList.toggle('on',s);
  });
}
function togVenta(){
  var on=document.getElementById('cl-venta').checked;
  hdn('av-venta',!on); hdn('sin-venta',on);
}
function updBaja(){
  var on=document.getElementById('baja').checked;
  document.getElementById('baja-txt').innerHTML=on
    ?'Los servicios deberan ser <strong>dados de baja</strong> y abonados hasta la fecha de entrega, entregando los comprobantes en el domicilio de la administradora.'
    :'Los servicios deberan ser abonados y <strong>NO dados de baja</strong>, entregando los comprobantes originales en el domicilio de la administradora.';
}

function calcV(){
  var ini=v('fi'); var dur=parseInt(v('dur')||'24');
  if(!ini) return;
  var d=new Date(ini+'T00:00:00');
  d.setMonth(d.getMonth()+dur); d.setDate(d.getDate()-1);
  document.getElementById('fv').value=String(d.getDate()).padStart(2,'0')+' de '+MESU[d.getMonth()]+' de '+d.getFullYear();
  calcP();
}
function calcP(){
  var s=v('alq').replace(/[.,]/g,'');
  var n=parseFloat(s);
  if(!isNaN(n)&&n>0) document.getElementById('pag-m').value='$'+(n*2).toLocaleString('es-AR');
  var ini=v('fi'); if(!ini) return;
  var dur=parseInt(v('dur')||'24');
  var df=new Date(ini+'T00:00:00');
  df.setMonth(df.getMonth()+dur); df.setDate(df.getDate()-1);
  var dp=new Date(df.getTime());
  dp.setMonth(dp.getMonth()+1);
  document.getElementById('pag-v').value=fSl(dp.toISOString().substring(0,10));
}

function chg(){
  if(!TIPO) return;
  var n=0;
  for(var i=0;i<OBL.length;i++){if(v(OBL[i])!=='') n++;}
  var pct=Math.round(n/OBL.length*100);
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('ppct').textContent=pct+'%';
  var ok=(n===OBL.length);
  var b=document.getElementById('bst');
  b.className='badge '+(ok?'bok':'bwrn');
  b.textContent=ok?'Listo':'Faltan '+(OBL.length-n)+' campo(s)';
  document.getElementById('btn-dl').disabled=!ok;
  document.getElementById('plbl').textContent=ok?'Todo completo!':'Completa los campos obligatorios (*)';
  calcP();
}

function limpiar(){
  if(!confirm('Limpiar todos los datos?')) return;
  var inputs=document.querySelectorAll('#fb input,#fb select,#fb textarea');
  inputs.forEach(function(e){
    if(e.type==='checkbox') e.checked=(e.id==='mascotas');
    else if(e.id==='loc-nac'||e.id==='loc2-nac') e.value='argentino';
    else if(e.tagName==='SELECT') e.selectedIndex=0;
    else e.value='';
  });
  document.querySelectorAll('#inst-grid input').forEach(function(cb){
    cb.checked=true; cb.closest('label').classList.add('on');
  });
  GEN={loc:'m',loc2:'m'}; GARS=[]; GC=0; LOCS=[]; LC=0;
  document.querySelectorAll('.gbtn .gb').forEach(function(b){b.classList.toggle('on',b.dataset.g==='m');});
  CLO={}; CLE={};
  hdn('pnl-cls',true);
  renderLocs(); renderGars(); addG();
  chg();
}

// ─── RENOVACION ───────────────────────────────────────────
async function procAnt(){
  var fi=document.getElementById('f-ant');
  var ti=v('txt-ant');
  var st=document.getElementById('st-ant');
  st.textContent='Procesando...'; st.style.color='';
  var txt='';
  if(fi.files&&fi.files[0]){
    try {
      var zip=new JSZip();
      var c=await zip.loadAsync(fi.files[0]);
      var xml=await c.file('word/document.xml').async('text');
      txt=xml.replace(/<\/w:p>/gi,'\n').replace(/<[^>]+>/g,'')
             .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
             .replace(/\n{3,}/g,'\n\n').trim();
    } catch(e){
      st.textContent='No se pudo leer el .docx. Pega el texto abajo.'; st.style.color='var(--or)'; return;
    }
  } else if(ti){
    txt=ti;
  } else {
    st.textContent='Subi un .docx o pega el texto.'; st.style.color='var(--or)'; return;
  }

  var datos=extrDatos(txt);
  var campos=['loc-n','loc-d','loc2-n','loc2-d','dir','barrio','ciudad','dgr','catastro','san','alq','fi'];
  var n=0;
  for(var i=0;i<campos.length;i++){
    var cid=campos[i];
    if(datos[cid]){
      var el=document.getElementById(cid);
      if(el&&!el.readOnly){el.value=datos[cid];el.style.background='#FFFDE7';el.setAttribute('data-pre','1');n++;}
    }
  }
  if(datos.dur){var de=document.getElementById('dur');if(de) de.value=datos.dur;}
  calcV(); chg();

  if(datos._cls){
    var keys=Object.keys(datos._cls);
    if(keys.length>0){
      CLO=datos._cls; CLE={}; for(var k in CLO) CLE[k]=CLO[k];
      renderCls(); hdn('pnl-cls',false);
    }
  }
  var nc=datos._cls?Object.keys(datos._cls).length:0;
  st.innerHTML='OK. Pre-llenados: <strong>'+n+'</strong>'+(nc?' | Clausulas: <strong>'+nc+'</strong>':'')+'. Revisa los campos amarillos.';
  st.style.color='var(--vd)';
}

function extrDatos(t){
  var d={};
  var re=/(?:Sr|Sra)[./]+\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]+?),\s*DNI[:\s]+([\d.]+)/g;
  var m; var ps=[];
  while((m=re.exec(t))!==null) ps.push({n:m[1].trim(),dni:m[2].trim()});
  if(ps[0]){d['loc-n']=ps[0].n;d['loc-d']=ps[0].dni;}
  if(ps[1]){d['loc2-n']=ps[1].n;d['loc2-d']=ps[1].dni;}
  var rx;
  rx=t.match(/(?:sita en calle|sito en calle|calle)\s+([^,\n]{5,60}?)(?:,|\sN°|\sBarrio)/i); if(rx) d['dir']=rx[1].trim();
  rx=t.match(/[Bb]arrio(?:\s+residencial)?\s+([A-ZÁÉÍÓÚÑ][^,\n.]{2,40}?)(?:,|\sde\s)/); if(rx) d['barrio']=rx[1].trim();
  rx=t.match(/ciudad de\s+([A-ZÁÉÍÓÚÑ][^,\n.]{2,30}?)(?:,|\sprovincia)/i); if(rx) d['ciudad']=rx[1].trim();
  rx=t.match(/identificaci[oó]n de la DGR es\s+([\dA-Z-]+)/i); if(rx) d['dgr']=rx[1].trim();
  rx=t.match(/suma de PESOS[^$\n]*\$\s*([\d.,]+)/i); if(rx) d['alq']=rx[1].replace(/\./g,'');
  rx=t.match(/PRIMERO\s*\(01\)\s*de\s*([A-ZÁÉÍÓÚÑ]+)\s*de\s*(\d{4})/i);
  if(rx){var mn=MESU.indexOf(rx[1].toUpperCase())+1;if(mn>0) d['fi']=rx[2]+'-'+String(mn).padStart(2,'0')+'-01';}
  rx=t.match(/t[eé]rmino de (VEINTICUATRO|TREINTA Y SEIS|CUARENTA Y OCHO|CIENTO VEINTE)/i);
  if(rx){var mp={'VEINTICUATRO':'24','TREINTA Y SEIS':'36','CUARENTA Y OCHO':'48','CIENTO VEINTE':'120'};d['dur']=mp[rx[1].toUpperCase()]||'24';}
  var cls={};
  var nms=['PRIMERA','SEGUNDA','TERCERA','CUARTA','QUINTA','SEXTA','SEPTIMA','OCTAVA','NOVENA','DECIMA','DECIMO PRIMERA','DECIMO SEGUNDA','DECIMO TERCERA','DECIMO CUARTA','DECIMO QUINTA','DECIMO SEXTA','DECIMO SEPTIMA','DECIMO OCTAVA','DECIMO NOVENA','VIGESIMA','VIGESIMA PRIMERA','VIGESIMA SEGUNDA','VIGESIMA TERCERA','VIGESIMA CUARTA'];
  for(var ni=0;ni<nms.length;ni++){
    var sig=nms[ni+1];
    var pat=nms[ni]+'[^:]*:[\s]*([\s\S]*?)(?='+(sig?sig+'[^:]*:':'ZZEND')+')';
    var rxc=new RegExp(pat,'i');
    var rm=t.match(rxc);
    if(rm&&rm[1].trim().length>10) cls[nms[ni]]=rm[1].trim();
  }
  d._cls=cls; return d;
}

function renderCls(){
  var lst=document.getElementById('lst-cls');
  while(lst.firstChild) lst.removeChild(lst.firstChild);
  var keys=Object.keys(CLO);
  for(var i=0;i<keys.length;i++){
    (function(nom){
      var key=nom.replace(/\s/g,'_');
      var d=document.createElement('div');
      d.style.cssText='margin-bottom:6px;border:1px solid var(--bd);border-radius:7px;overflow:hidden';
      var hdr=document.createElement('div');
      hdr.style.cssText='background:var(--bg);padding:7px 12px;font-size:11px;font-weight:700;color:#7B3F00;display:flex;align-items:center;justify-content:space-between;cursor:pointer';
      var hdrSpan=document.createElement('span'); hdrSpan.textContent=nom;
      var badge=document.createElement('span'); badge.id='bcl-'+key; badge.style.cssText='font-size:10px;color:var(--g);font-weight:normal'; badge.textContent='Sin cambios';
      hdr.appendChild(hdrSpan); hdr.appendChild(badge);
      hdr.onclick=function(){togCl(key);};
      var body=document.createElement('div');
      body.id='clb-'+key; body.style.cssText='display:none;padding:8px';
      var ta=document.createElement('textarea');
      ta.id='clt-'+key;
      ta.style.cssText='width:100%;min-height:75px;font-size:11px;font-family:inherit;padding:7px;border:1px solid var(--bd);border-radius:5px;resize:vertical';
      ta.value=CLO[nom];
      (function(n){ta.oninput=function(){onCl(n);};})(nom);
      body.appendChild(ta);
      d.appendChild(hdr); d.appendChild(body); lst.appendChild(d);
    })(keys[i]);
  }
}
function togCl(key){
  var b=document.getElementById('clb-'+key);
  var open=(b.style.display!=='none');
  b.style.display=open?'none':'block';
}
function onCl(nom){
  var key=nom.replace(/\s/g,'_');
  var t=document.getElementById('clt-'+key).value;
  CLE[nom]=t;
  var badge=document.getElementById('bcl-'+key);
  if(badge) badge.textContent=(t!==CLO[nom])?'Modificada':'Sin cambios';
}
function getCambios(){
  var r={};
  for(var n in CLE){if(CLE[n]!==CLO[n]) r[n]=CLE[n];}
  return r;
}

// ─── WORD ─────────────────────────────────────────────────
function wP(txt,opts){
  opts=opts||{};
  var bold=opts.b||false, ctr=opts.c||false, sb=opts.sb||60, sa=opts.sa||80, col=opts.col||null, hi=opts.hi||false;
  var jc=ctr?'<w:jc w:val="center"/>':'<w:jc w:val="both"/>';
  var sp='<w:spacing w:before="'+sb+'" w:after="'+sa+'" w:line="240" w:lineRule="auto"/>';
  var rp='<w:rFonts w:ascii="Verdana" w:hAnsi="Verdana"/><w:sz w:val="24"/><w:szCs w:val="24"/>';
  if(bold) rp+='<w:b/><w:bCs/>';
  if(col) rp+='<w:color w:val="'+col+'"/>';
  if(hi) rp+='<w:highlight w:val="yellow"/>';
  return '<w:p><w:pPr>'+jc+sp+'</w:pPr><w:r><w:rPr>'+rp+'</w:rPr><w:t xml:space="preserve">'+E(String(txt))+'</w:t></w:r></w:p>';
}
function wL(){return '<w:p><w:pPr><w:spacing w:before="120" w:after="120"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="000000"/></w:pBdr></w:pPr></w:p>';}

function getInst(){
  var mp={cloacas:'cloacas',camara:'camara septica',pozo:'pozo negro',revoques:'revoques',pinturas:'pinturas',zocalos:'zocalos',vidrios:'vidrios',cerraduras:'cerraduras',llaves:'llaves',puertas:'puertas',ventanas:'ventanas',caldera:'caldera de calefaccion',radiadores:'radiadores',calefactores:'calefactores',aire:'equipos de aire acondicionado',calefon:'calefon',termotanque:'termo tanque',piscina:'equipo de mantenimiento de piscina'};
  var r=[];
  document.querySelectorAll('#inst-grid input[type=checkbox]').forEach(function(cb){if(cb.checked&&mp[cb.value]) r.push(mp[cb.value]);});
  return r.join(', ');
}
function getRest(){
  var mp={'r-caldera':'caldera de calefaccion y radiadores','r-calef':'calefactores','r-aire':'equipos de aire acondicionado','r-pisc':'equipo de mantenimiento de piscina'};
  var r=[];
  document.querySelectorAll('input[value^="r-"]').forEach(function(cb){if(cb.checked&&mp[cb.value]) r.push(mp[cb.value]);});
  return r.length?r.join(', '):'los equipos existentes';
}

async function genWord(){
  try {
    var T=TIPO, L=T==='local', D=(T==='depto'||T==='estrenar'), SE=T==='estrenar', C=T==='country';
    var hasMasc=D&&document.getElementById('mascotas').checked;
    var inclV=document.getElementById('cl-venta').checked;
    var bajaS=document.getElementById('baja').checked;
    var dur=v('dur');
    var dL={'24':'VEINTICUATRO (24)','36':'TREINTA Y SEIS (36)','48':'CUARENTA Y OCHO (48)','120':'CIENTO VEINTE (120)'}[dur]||'VEINTICUATRO (24)';
    var inst=getInst(), art=v('artef')||'XXXXXXXXX', rest=getRest();
    var bajaTxt=bajaS
      ?'Con respecto a los servicios de luz y gas natural (si correspondiera), los mismos deberan ser dados de baja y abonados hasta la fecha de entrega del inmueble, debiendo entregar los comprobantes correspondientes en el domicilio de la empresa administradora.-'
      :'Con respecto a los servicios de luz y gas natural (si correspondiera), los mismos deberan ser abonados y no dados de baja, debiendo entregar los comprobantes originales pagados correspondientes en el domicilio de la empresa administradora.-';
    var lG=gT('loc'), l2G=gT('loc2');
    var alqN=parseFloat(v('alq').replace(/[.,]/g,''))||0;
    var pagM=alqN>0?'$'+(alqN*2).toLocaleString('es-AR'):'XXXXXXXXXXXX';
    var pagV=v('pag-v')||'XX/XX/XXXX';
    var coch=v('cochera')?' y una cochera en subsuelo designada como cochera '+v('cochera'):'';
    var NUMS=['PRIMERA','SEGUNDA','TERCERA','CUARTA','QUINTA','SEXTA','SEPTIMA','OCTAVA','NOVENA','DECIMA','DECIMO PRIMERA','DECIMO SEGUNDA','DECIMO TERCERA','DECIMO CUARTA','DECIMO QUINTA','DECIMO SEXTA','DECIMO SEPTIMA','DECIMO OCTAVA','DECIMO NOVENA','VIGESIMA','VIGESIMA PRIMERA','VIGESIMA SEGUNDA','VIGESIMA TERCERA','VIGESIMA CUARTA'];
    var ni=0;
    function cl(){return NUMS[ni++]+':';}
    var c='';
    c+=wP('CONTRATO DE LOCACION',{b:true,c:true,sb:160,sa:200});
    c+=wL();
    c+=wP(lG.el+'/la '+lG.sr+'/Sra. '+v('loc-n')+', DNI:'+v('loc-d')+', '+v('loc-nac')+', mayor de edad, '+lG.nacido+' el '+fL(v('loc-fn'))+', por una parte y en adelante tambien llamado "El Locador", y por la otra '+l2G.el+'/la '+l2G.sr+'/Sra. '+v('loc2-n')+', DNI: '+v('loc2-d')+', '+v('loc2-nac')+', mayor de edad, '+l2G.nacido+' el '+fL(v('loc2-fn'))+locsExtra()+' en adelante tambien llamada "El Locatario", se ha convenido en celebrar el siguiente contrato de locacion de inmueble que se regira por las siguientes clausulas:');

    c+=wP(cl(),{b:true,sb:200,sa:80});
    if(SE) c+=wP('El Locador, cede en locacion al Locatario y este acepta, el bien inmueble de su propiedad que se describe como: Un departamento sito en calle '+v('dir')+', Barrio '+v('barrio')+', de la ciudad de '+v('ciudad')+', provincia de Cordoba y cuya identificacion de la DGR es '+v('dgr')+'. La descripcion del inmueble y su equipamiento se encuentra detallada en el anexo 1- acta de inventario, que forma parte integrante de este contrato'+coch+'. El departamento es "a estrenar", y se encuentra en perfecto estado de conservacion e higiene, que el Locatario declara conocer y aceptar, corriendo exclusivamente a partir de la fecha el mantenimiento, limpieza y/o reparacion de todas las instalaciones por exclusiva cuenta del Locatario. Esta locacion se pacta por el termino de '+dL+' meses a contar del dia PRIMERO (01) de '+fLU(v('fi'))+', venciendo en consecuencia el dia '+v('fv')+', para ser destinado a vivienda exclusivamente, no pudiendo el locatario darle otro destino.-');
    else if(L) c+=wP('El Locador, cede en locacion al Locatario y este acepta, el bien inmueble de su propiedad que se describe como un Local comercial/oficina'+(v('sup')?' de '+v('sup')+' m2,':'')+(v('sup')?'':',')+' sito en calle '+v('dir')+', Barrio '+v('barrio')+', de la ciudad de '+v('ciudad')+', provincia de Cordoba y cuya identificacion de la DGR es '+v('dgr')+'. Esta locacion se pacta por el termino de '+dL+' meses a contar del dia PRIMERO (01) de '+fLU(v('fi'))+', venciendo en consecuencia el dia '+v('fv')+', para ser destinado a uso comercial exclusivamente, no pudiendo el locatario darle otro destino.-');
    else if(C) c+=wP('El Locador, cede en locacion al Locatario y este acepta, el bien inmueble de su propiedad que se describe como: Una casa sita en calle '+v('dir')+', Barrio residencial '+v('barrio')+', de la ciudad de '+v('ciudad')+', provincia de Cordoba y cuya identificacion de la DGR es '+v('dgr')+'. Esta locacion se pacta por el termino de '+dL+' meses a contar del dia PRIMERO (01) de '+fLU(v('fi'))+', venciendo en consecuencia el dia '+v('fv')+', para ser destinado a vivienda exclusivamente, no pudiendo el locatario darle otro destino.-');
    else if(D) c+=wP('El Locador, cede en locacion al Locatario y este acepta, el bien inmueble de su propiedad que se describe como: Un departamento sito en calle '+v('dir')+', Barrio '+v('barrio')+', de la ciudad de '+v('ciudad')+', provincia de Cordoba y cuya identificacion de la DGR es '+v('dgr')+'. Esta locacion se pacta por el termino de '+dL+' meses a contar del dia PRIMERO (01) de '+fLU(v('fi'))+', venciendo en consecuencia el dia '+v('fv')+', para ser destinado a vivienda exclusivamente, no pudiendo el locatario darle otro destino.-');
    else c+=wP('El Locador, cede en locacion al Locatario y este acepta, el bien inmueble de su propiedad que se describe como: Una casa, sita en calle '+v('dir')+', Barrio '+v('barrio')+', de la ciudad de '+v('ciudad')+', provincia de Cordoba y cuya identificacion de la DGR es '+v('dgr')+'. Esta locacion se pacta por el termino de '+dL+' meses a contar del dia PRIMERO (01) de '+fLU(v('fi'))+', venciendo en consecuencia el dia '+v('fv')+', para ser destinado a vivienda exclusivamente, no pudiendo el locatario darle otro destino.-');

    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Queda prohibido al Locatario, ceder el presente contrato, transferir, subarrendar, prestar total o parcialmente la propiedad o hacerse reemplazar por terceros'+(L?'.-':' ( art. 1213 y 1214  CCYC).-'));
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El precio mensual inicial de la locacion se establece de comun acuerdo entre las partes en la suma de PESOS '+v('alq').toUpperCase()+' ($ '+v('alq')+'.-) mas el Impuesto al Valor Agregado (si correspondiere). El locatario se compromete a pagar el precio contractual con periodicidad mensual, en forma anticipada y durante cada uno de los '+dL+' meses siguientes al inicio de la vigencia del contrato. El precio de alquiler mensual se ajustara en forma trimestral, utilizando el Indice de Precios al Consumidor (IPC) elaborado y publicado mensualmente por el INDEC para los tres (3) meses ante anteriores al mes de reajuste. El Locatario se obliga a satisfacer el precio, regularmente en el domicilio de la Empresa administradora ROBERTS OTERO SERVICIOS INMOBILIARIOS S.A.S, CUIT: 33-71619127-9, calle Rio de Janeiro 1725, Torre 1, oficina 11, Villa Allende'+(L?' Office':'')+', de esta ciudad o en el que con posterioridad se indique, en forma anticipada y del UNO (01) al DIEZ (10) de cada mes, de Lunes a Viernes (excluidos dias feriados) en el horario de 9,00 hs a 14,00 hs. Estos pagos deberan realizarse '+(L?'en dinero en efectivo, transferencia bancaria':'mediante transferencia bancaria a los bancos de los que oportunamente la administracion informe el CBU correspondiente')+' o con cheque fecha de cobro al dia de la ciudad de Cordoba, a la orden de ROBERTS OTERO SERVICIOS INMOBILIARIOS S.A.S, quedando convenido que el mero vencimiento del plazo establecido, hara incurrir en mora de pleno derecho al Locatario. El Locatario asume expresamente la obligacion de acreditar fehacientemente el deposito o transferencia bancaria que realice dentro del plazo de 24 horas de su ejecucion a fin que la Administradora pueda imputar y rendir el pago al Locador y otorgar el correspondiente recibo de pago al Locatario. La falta de cumplimiento en termino con esta obligacion hara incurrir al Locatario en mora de pleno derecho y en forma automatica, generando los recargos y multas fijadas en el contrato.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    if(L) c+=wP('El Locatario declara haber visitado y examinado la propiedad, estando conforme en recibir el inmueble en las buenas condiciones de conservacion e higiene en que se encuentra, comprometiendose a mantenerla en buen estado y siendo a su cargo la reparacion de todo desperfecto que se ocasione desde la fecha de iniciacion de este contrato, en los servicios de agua, electricidad, gas, '+inst+'. Tambien sera responsable de todo dano a la unidad alquilada, por hechos de terceros en su construccion, mamposteria, revoques, pinturas, revestimientos, instalaciones sanitarias, de gas y electricas y sus respectivos artefactos a saber: '+art+'. El Locatario queda obligado al desocupar el inmueble, a hacer entrega de todas las dependencias en el mismo estado en que fue recibido. A los fines de la devolucion del inmueble, el Locatario a su exclusivo cargo, se obliga a solicitar a la Administracion al menos con TREINTA (30) dias de anticipacion el chequeo y la revision integral de los mismos por parte de los equipos tecnicos de la Administracion.');
    else c+=wP('El Locatario declara haber visitado y examinado la propiedad, estando conforme en recibir el inmueble en las buenas condiciones de conservacion e higiene en que se encuentra, contando con un plazo de diez (10) dias habiles desde la firma para notificar por escrito a la empresa administradora de las anomalias que encuentre. Se compromete a mantener el inmueble locado en buen estado, siendo a su cargo la reparacion de todo desperfecto que se ocasione desde la fecha de iniciacion de este contrato y producto de su mal uso, en los servicios que se suministren al inmueble como asi tambien en '+inst+'; como asi tambien de todo dano a la unidad alquilada por hechos de terceros en su construccion, mamposteria, revoques, pinturas, revestimientos, instalaciones sanitarias, de gas y electricas y sus respectivos artefactos a saber: '+art+'. El Locatario queda obligado al desocupar el inmueble, a hacer entrega de todas las dependencias en el mismo estado en que fue recibido, salvo aquellos deterioros ocasionados por el buen uso moderado del inmueble. A los fines de la devolucion del inmueble, el Locatario a su exclusivo cargo, se obliga a solicitar a la Administracion al menos con TREINTA (30) dias de anticipacion el chequeo y la revision integral de los mismos por parte de los equipos tecnicos de la Administracion.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El Locatario, permitira al Locador, o a quien lo represente la inspeccion de la propiedad cuando este lo estime necesario, y en caso de producirse algun desperfecto que afecte la estabilidad o seguridad de la propiedad, el Locatario esta obligado a comunicarlo en forma fehaciente al Locador, dentro de las veinticuatro (24) horas de producido.'+(hasMasc?' Queda expresamente prohibido tener mascotas de cualquier raza y especie, siendo este, causal de rescision del presente contrato debiendo abonar el locatario las penalidades previstas para los casos de rescision anticipada.-':' '));
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El Locatario no podra efectuar en la propiedad ninguna innovacion, alteracion o mejora en la construccion sin el previo consentimiento por escrito del Locador'+(L?'; las que se hiciesen debidamente autorizadas quedaran en beneficio exclusivo del inmueble, sin cargo de indemnizacion.':'. Las que se hiciesen, debidamente autorizadas, quedaran en beneficio exclusivo del inmueble sin cargo de indemnizacion.')+' Las mejoras que se introduzcan deberan respetar todo lo atinente a disposiciones municipales y provinciales vigentes, estando estrictamente prohibida la alteracion funcional de la propiedad.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El Locatario se obliga a registrar de inmediato '+(L?'ante la empresa de electricidad y gas, los servicios de Luz y Gas (si correspondiere),':'ante las empresas de electricidad y gas (si correspondiere) los servicios correspondientes,')+' a su nombre y a dejarlos pagos hasta el dia en que haga devolucion del inmueble, declarando conocer que no debe abonar factura alguna por servicios anteriores a la fecha de iniciacion del contrato. El Locatario se compromete a contratar '+(SE?'un seguro de incendio y responsabilidad civil sobre el inmueble locado':'un seguro de incendio, y responsabilidad civil hacia linderos sobre el inmueble locado')+' por el periodo que dure este contrato, endosando la poliza'+(SE?'':' de incendios')+' a favor del Locador, con actualizacion anual. El Locatario debera entregar la poliza dentro de los 15 (quince) dias de firmado el contrato.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Quedan por cuenta y cargo exclusivo del Locatario y TAMBIEN FORMAN PARTE DEL PRECIO DE LA LOCACION el pago en termino del servicio de obras sanitarias y/o agua domiciliaria (unidad de facturacion numero de cuenta '+(v('san')||'XXXX')+') y/o cualquier otro servicio y/o accesorio que recae sobre la unidad locada, como asi tambien el pago de la tasa municipal por alumbrado, barrido y limpieza (identificacion catastral '+(v('catastro')||'XXX')+') y el pago del impuesto provincial (DGR numero de cuenta '+(v('dgr')||'XXXXX')+'). Las obligaciones descriptas seran abonadas por la empresa administradora quien posteriormente las cobrara al Locatario. Por lo tanto no se considerara cumplida la prestacion dineraria por parte del Locatario ni sera obligacion del Locador recibir el pago, si no se abonara conjuntamente con el alquiler los servicios, expensas y accesorios precedentemente mencionados, correspondientes al mes en curso. En el caso de mero atraso, los intereses, reajustes, punitorios y/o adicionales correran por exclusiva cuenta del Locatario.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Se deja expresa constancia que el Locatario suscribe como garantia de la presente locacion un pagare por la suma de Pesos '+pagM+' ('+pagM+'.-) con fecha de vencimiento el dia '+pagV+'. El mismo sera devuelto al Locatario siempre que se hayan cancelado todas las obligaciones emanadas del presente. En caso de producirse la rescision anticipada del presente, el pagare se utilizara a los mismos efectos descriptos precedentemente y no se aplicara a las indemnizaciones que debiera abonar el Locatario por la resolucion anticipada del contrato.-');
    if(D||L){
      c+=wP(cl(),{b:true,sb:200,sa:80});
      c+=wP('Son a cargo del Locatario y tambien FORMAN PARTE DEL PRECIO DE LA LOCACION, ademas de lo estipulado en la clausula tercera, el pago de las Expensas Comunes Ordinarias asignadas a la unidad locada, por el consorcio del que forma parte y conforme a las disposiciones del Reglamento de Copropiedad. Los importes correspondientes a Expensas Extraordinarias seran soportados por el Locador, y en el caso que sean incluidos dentro del cupon de pago de las expensas comunes mensuales, estos seran abonados por el Locatario y descontados del importe a abonar en concepto de canon locativo correspondiente al mismo periodo. Por lo tanto no se considerara pagado el alquiler mensual, ni sera obligacion del Locador recibir el pago del mismo, si no se abonan las Expensas Comunes en la forma establecida por ser estos PARTE INTEGRANTE DEL PRECIO DEL ALQUILER. El Locatario debera acatar todas las normas contenidas en el reglamento de copropiedad y reglamento interno del edificio, las que declara conocer y aceptar.'+(v('consorcio')?' ('+v('consorcio')+').-':'.-'));
    }
    c+=wP(cl(),{b:true,sb:200,sa:80});
    var moraT='';
    if(C) moraT='La falta de pago en termino del alquiler, las Expensas o Gastos Comunes o cualquier otra obligacion a cargo del Locatario lo hara incurrir en mora de pleno derecho, sin necesidad de requerimiento previo de ninguna naturaleza y las sumas adeudadas devengaran un interes punitorio fijado a opcion del Locador, que en su caso establecera segun los siguientes sistemas: A) Un interes punitorio mensual igual a una vez y media (1,5) la tasa efectiva mensual vencida (T.E.M. 30 dias) que publica el Banco de la Nacion Argentina. B) El equivalente al cero con treinta por ciento (0,30%) diario del monto de las sumas adeudadas, computandose su calculo desde el primer dia calendario del mes en que se produzca la mora. Ello tambien sin perjuicio de iniciar el Locador, las acciones judiciales por cobro de alquileres, desalojo o cualquiera que corresponda en su caso, pactandose que los alquileres, servicios, expensas y demas accesorios, podran ser reclamados por el procedimiento ejecutivo. El Locador podra negarse a percibir cualquiera de estas obligaciones, sin el pago conjunto de la penalidad establecida.-';
    else if(D) moraT='La falta de pago en termino del alquiler, las Expensas o Gastos Comunes o cualquier otra obligacion a cargo del Locatario lo hara incurrir en mora de pleno derecho, sin necesidad de requerimiento previo de ninguna naturaleza y las sumas adeudadas devengaran un interes punitorio fijado a opcion del Locador, que en su caso establecera segun los siguientes sistemas: A) Un interes punitorio mensual igual a una vez y media (1,5) la tasa para descuentos de documentos a treinta (30) dias de plazo que aplica el Banco de la Nacion Argentina. B) El equivalente al cero con treinta por ciento (0,30%) diario del monto de las sumas adeudadas, computandose su calculo desde el primer dia calendario del mes en que se produzca la mora. Ello tambien sin perjuicio de iniciar el Locador, las acciones judiciales por cobro de alquileres, desalojo o cualquiera que corresponda en su caso, pactandose que los alquileres, servicios, expensas y demas accesorios, podran ser reclamados por el procedimiento ejecutivo. El Locador podra negarse a percibir cualquiera de estas obligaciones, sin el pago conjunto de la penalidad establecida.-';
    else if(L) moraT='La falta de pago en termino del alquiler o cualquier otra obligacion a cargo del Locatario lo hara incurrir en mora de pleno derecho, sin necesidad de requerimiento previo de ninguna naturaleza y las sumas adeudadas devengaran un interes punitorio fijado a opcion del Locador, que en su caso establecera segun los siguientes sistemas: A) Un interes punitorio mensual igual a una vez y media (1,5) la tasa para descuentos de documentos a treinta (30) dias de plazo que aplica el Banco de la Nacion Argentina. B) El equivalente al cero con treinta por ciento (0,30%) diario del monto de las sumas adeudadas, computandose su calculo desde el primer dia calendario del mes en que se produzca la mora. Ello tambien sin perjuicio de iniciar el Locador, las acciones judiciales por cobro de alquileres, desalojo o cualquiera que corresponda en su caso, pactandose que los alquileres, tributos, servicios, expensas y demas accesorios podran ser reclamados por el procedimiento ejecutivo. El Locador podra negarse a percibir cualquiera de estas obligaciones, sin el pago conjunto de la penalidad establecida.-';
    else moraT='La falta de pago en termino del alquiler o cualquier otra obligacion a cargo del Locatario lo hara incurrir en mora de pleno derecho, sin necesidad de requerimiento previo de ninguna naturaleza y las sumas adeudadas devengaran un interes punitorio fijado a opcion del Locador, que en su caso establecera segun los siguientes sistemas: A) Un interes punitorio mensual igual a una vez y media (1,5) la tasa para descuentos de documentos a treinta (30) dias de plazo que aplica el Banco de la Nacion Argentina. B) El equivalente al cero con treinta por ciento (0,30%) diario del monto de las sumas adeudadas, computandose su calculo desde el primer dia calendario del mes en que se produzca la mora. Ello tambien sin perjuicio de iniciar el Locador, las acciones judiciales por cobro de alquileres, desalojo o cualquiera que corresponda en su caso, pactandose que los alquileres, servicios, expensas y demas accesorios, podran ser reclamados por el procedimiento ejecutivo. El Locador podra negarse a percibir cualquiera de estas obligaciones, sin el pago conjunto de la penalidad establecida.-';
    c+=wP(moraT);
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Cualquier incumplimiento a lo estipulado en el presente contrato por parte del Locatario, y especialmente la demora en '+(L?'TREINTA DIAS':'treinta dias')+' o mas en el pago del alquiler, '+(L?'servicios, Gastos Comunes si correspondiera,':C?'impuestos, servicios, expensas,':D?'servicios, expensas,':'servicios,')+' intereses, ajustes, adicionales etc., facultara al Locador a declararlo rescindido, pudiendo exigir el desalojo inmediato como si se tratara de un contrato vencido. Sin perjuicio de reclamar las responsabilidades en que hubiese incurrido el Locatario y/o su '+(L?'personal':'familia')+', por los danos y perjuicios que erogue esta situacion.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Las partes manifiestan que este contrato de locacion se rige estrictamente por las disposiciones referidas al Contrato de Locacion, articulo 1187 siguientes y concordantes del Codigo Civil y Comercial, dejanndose aclarado que si al vencimiento del termino contractual el Locatario continuase en el uso y ocupacion de la unidad alquilada, sin perjuicio de la accion de desalojo que corresponda al Locador y en concepto de clausula punitiva e indemnizacion (art.790 CCYC), abonara ademas del importe del alquiler mensual ultimo, una suma diaria de Pesos equivalentes al DIEZ POR CIENTO (10%) de la merced locativa vigente, por cada dia que demorase en la restitucion del bien locado.-');
    // GARANTES
    c+=wP(cl(),{b:true,sb:200,sa:80});
    var garTxt='';
    for(var gi=0;gi<GARS.length;gi++){
      var gid=GARS[gi].id; var gG=gT(gid);
      garTxt+=(gi>0?' y ':'')+gG.el+'/La '+gG.sr+'/a. '+(v(gid+'-n')||'XXXXXXXXXXX')+', DNI '+(v(gid+'-d')||'XXXXXX')+', '+(GARS[gi].gen==='m'?'argentino':'argentina')+', mayor de edad, '+gG.nacido+' el '+fL(v(gid+'-fn'))+', con domicilio en '+(v(gid+'-dom')||'XXXXXXXXXX')+', barrio '+(v(gid+'-barrio')||'XXXXXXXX')+', ciudad de '+(v(gid+'-ciudad')||'XXXXXXXX')+', '+gTxt(gid);
    }
    var nG=GARS.length;
    garTxt+='; '+(nG>1?'suscriben':'suscribe')+' este contrato como Fiador'+(nG>1?'es':'')+' y Garante'+(nG>1?'s':'')+', solidario'+(nG>1?'s':'')+', liso'+(nG>1?'s':'')+', llano'+(nG>1?'s':'')+' y principal'+(nG>1?'es':'')+' pagador'+(nG>1?'es':'')+' de todas y cada una de las obligaciones emergentes del presente contrato haciendo expresa renuncia a los beneficios de division y excusion que pudieran corresponderle, por el incumplimiento de todas y cada una de las obligaciones contraidas por el Locatario en el presente contrato; garantizando igualmente el pago de los honorarios y gastos de juicios que se promovieren contra el Locatario, por cobro de alquileres, desalojo, posesion judicial, danos y perjuicios, desperfectos, etc.- La Fianza y demas clausulas subsistiran aun vencido el termino contractual y hasta tanto el Locatario restituya al Locador la unidad que se alquila y entregue los comprobantes de pago de los servicios: EPEC, ECOGAS y expensas comunes. En caso de que los Fiadores dispusiesen o gravaren el bien de su propiedad ofrecido en garantia del presente contrato, o que de cualquier forma disminuyesen su solvencia patrimonial, sera obligatorio el reemplazo o refuerzo de la garantia. Los Fiadores quedan obligados a informar al Locador si venden, transfieren, gravan o de algun modo disminuyen el valor de la propiedad que declaran poseer y en base a la cual el Locador los ha aceptado como garantia del presente.-';
    c+=wP(garTxt);
    var tieneInm=false;
    for(var ti=0;ti<GARS.length;ti++){var vt=v(GARS[ti].id+'-tipo')||'inmueble';if(vt==='inmueble'||vt==='ambos'){tieneInm=true;break;}}
    var colC=tieneInm?null:'FF0000';
    var g1=GARS[0]||{id:'g1',gen:'m'}; var g1G=gT(g1.id); var cony1=v(g1.id+'-cony');
    c+=wP('Se deja expresa constancia que '+g1G.el+'/la '+g1G.sr+'/a. '+(cony1||v(g1.id+'-n')||'XXXXXXXXXXXX')+', M.I. '+(v(g1.id+'-conyd')||v(g1.id+'-d')||'XXXXXXXX')+', con domicilio en calle '+(v(g1.id+'-dom')||'XXXXXX')+', de la ciudad de '+(v(g1.id+'-ciudad')||'XXXXXXXXX')+' en la provincia de Cordoba, garante de este contrato'+(cony1?' y su conyuge '+g1G.el+'/la '+g1G.sr+'/a. '+cony1+', MI. '+(v(g1.id+'-conyd')||'XXXXXXXX')+',':',')+' renuncia/n a los beneficios que le otorga la Ley Provincial 8067 (Inembargabilidad de la vivienda unica) en un todo de acuerdo a lo dispuesto por el Art. 4 de la mencionada Ley.- OJO QUE SIEMPRE DEBE FIRMAR EL CONYUGE SI ESTA CASADO PARA PRESTAR EL CONSENTIMIENTO',{col:colC});
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('A los efectos de la restitucion del inmueble una vez vencido el termino contractual, se aclara que el Locatario debera proceder de la siguiente manera: 1) El inmueble debera entregarse en el mismo buen estado de conservacion e higiene que fue entregado segun consta en el presente contrato'+(SE?', salvo el desgaste natural producido en las cosas por su correcto uso y el transcurso del tiempo. Ademas debera presentar':', debiendo presentar')+' los comprobantes que demuestren los servicios de mantenimiento realizados a: '+rest+'. 2) '+bajaTxt);
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Las partes acuerdan que durante todo el periodo en que el Locatario tenga la tenencia del inmueble locado y hasta la recepcion definitiva del mismo por parte de la Locadora y/o su representante, esta queda eximida de cualquier tipo de responsabilidad contractual o extracontractual por danos de cualquier especie que sufran personas y/o cosas en el inmueble locado y/o sus dependencias. A tal efecto el Locatario '+(C?'contratara':'debera contratar')+' un seguro de responsabilidad civil hacia terceros por cualquier tipo de hechos que ocurrieran en el inmueble locado durante la vigencia del presente y aun vencido el mismo hasta tanto el Locatario haga devolucion efectiva del inmueble al Locador.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    var rescT='El Locatario podra rescindir el presente contrato despues de los primeros cuatro meses de arriendo, debiendo comunicar en forma fehaciente y con, al menos, sesenta (60) dias de anticipacion al LOCADOR. De producirse tal alternativa durante el primer ano de alquiler, el LOCATARIO debera abonar el equivalente a un mes y medio de alquiler, en concepto de indemnizacion, y el equivalente a un mes si rescindiera transcurrido un ano de contrato. De hacer uso de la opcion de resolucion anticipada de contrato, el Locatario se obliga a facilitar al Locador dentro de los treinta dias habiles anteriores a la entrega del inmueble, su ofrecimiento y muestra a terceros interesados en ocuparlo, en dias habiles y horarios razonables, minimamente una vez por semana.-';
    if(inclV) rescT+=' Asimismo el Locador podra rescindir el presente contrato ante la posibilidad cierta de venta del inmueble objeto del presente; a tal efecto debera notificar al Locatario con una antelacion de tres (3) meses a la fecha en que se solicite la desocupacion y poniendo a disposicion del Locatario el instrumento que fundamente el pedido de rescision (boleto de compraventa, seña, escritura, etc), no pudiendo ejercer dicha facultad de rescision antes de que hayan transcurrido seis (6) meses desde la efectiva entrega y toma de posesion del inmueble por parte del Locatario.-';
    c+=wP(rescT);
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El Locatario y los Fiadores RENUNCIAN expresamente al derecho de recusar sin causa al Tribunal en caso de iniciarse contra los mismos o contra cualquiera de ellos, acciones judiciales que tengan por base el inmueble objeto del presente contrato, como asi tambien renuncian expresamente a la limitacion acordada por el Art. 730 del C.C.yC. en relacion a las costas judiciales que estuvieran o pudieran estar a su cargo.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El Locatario se compromete a reintegrar el inmueble recien pintado al latex blanco en sus muros y techos, tanto interiores como exteriores (si correspondiere). La mano de obra sera a eleccion del Locador.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Los contratantes manifiestan que es voluntad de las partes mantener el valor locativo del inmueble en terminos logicos y equiparables a unidades similares. Razon por la cual, si la inflacion desbordara los precios convenidos en el presente contrato, Locador y Locatario se comprometen a encontrar un mecanismo compensatorio que evite que una parte se beneficie en forma ostentosa respecto de la otra. Para el caso de que surjan nuevas normas que permitan la actualizacion de los alquileres, las partes convienen de comun acuerdo que procedera a su utilizacion en el presente contrato.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Se deja expresa constancia que '+g1G.el+'/la '+g1G.sr+'/a. '+(v(g1.id+'-n')||'XXXXXXXXXXXX')+', '+(g1.gen==='m'?'argentino':'argentina')+', mayor de edad, '+g1G.nacido+' el '+fL(v(g1.id+'-fn'))+', M.I. '+(v(g1.id+'-d')||'XXXXXXXX')+', con domicilio en '+(v(g1.id+'-dom')||'XXXXXX')+', de la ciudad de '+(v(g1.id+'-ciudad')||'XXXXXXXXX')+' en la provincia de Cordoba, garante de este contrato'+(cony1?' y su conyuge '+g1G.el+'/la '+g1G.sr+'/a. '+cony1+', MI. '+(v(g1.id+'-conyd')||'XXXXXXXX')+',':' y su conyuge la/el Sra/Sr, XXXXXXXXXXXXXX, MI. XXXXXXXX,')+' renuncia/n a los beneficios que le otorga la Ley Provincial 8067 (Inembargabilidad de la vivienda unica) en un todo de acuerdo a lo dispuesto por el Art. 4 de la mencionada Ley.- OJO QUE SIEMPRE DEBE FIRMAR EL CONYUGE SI ESTA CASADO PARA PRESTAR EL CONSENTIMIENTO',{col:colC});
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Por el presente el Locador otorga mandato expreso a ROBERTS OTERO SERVICIOS INMOBILIARIOS S.A.S'+(D||C?',':'')+' para que en su nombre y representacion, perciba los alquileres mensuales, otorgue el correspondiente recibo, formule las intimaciones previstas por el C.C.yC. y accione judicialmente persiguiendo el cobro y/o el desalojo del inmueble objeto de la locacion si correspondiere y la realizacion de todo otro acto que estime necesario para una mejor administracion del inmueble y mejora de la renta que el mismo puede proporcionar, quedando el locatario notificado de ello en forma fehaciente por la mera suscripcion de este contrato.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('El sellado, honorarios y demas gastos que se originen en el presente contrato, seran abonados exclusivamente por el Locatario.-');
    c+=wP(cl(),{b:true,sb:200,sa:80});
    c+=wP('Las partes que suscriben este contrato renuncian al fuero federal o a cualquier otro de excepcion que pudiese corresponderles, y se someten a la jurisdiccion de los Tribunales ordinarios de la ciudad de Cordoba para cualquier cuestion que por el presente pudiese suscitarse entre las mismas. A todos los efectos del presente contrato, las partes constituyen los siguientes domicilios especiales: La parte locadora en: la empresa administradora, ROBERTS OTERO SERVICIOS INMOBILIARIOS S.A.S, Avenida Rio de Janeiro N 1.725 Torre 1 oficina 11; e-mail secretariava@juarezbeltran.com.ar; la parte Locataria: en calle '+(v('loc2-dom')||'XXXXXX')+', email '+(v('loc2-em')||'XXXX')+', y los Fiadores constituyen domicilio especial en '+(v(g1.id+'-dom')||'XXXXXXXX')+', e-mail '+(v('loc-em')||'XXXXXXXX')+'. Conforme las partes previa lectura y ratificacion, se firman tres ejemplares de un mismo tenor y a un solo efecto, en la Ciudad de Villa Allende a '+fFirma(v('firma'))+'.-');
    if(C&&v('nom-cntry')&&v('reglamento')==='si'){
      c+=wP('OJO: si estas haciendo un contrato de '+v('nom-cntry')+' debe adjuntarse el reglamento interno.',{col:'FF0000',b:true,sb:160});
    }
    if(MODO==='renov'){
      var cbs=getCambios(); var cbKeys=Object.keys(cbs);
      if(cbKeys.length>0){
        c+=wL();
        c+=wP('CLAUSULAS MODIFICADAS EN ESTA RENOVACION:',{b:true,sb:300,sa:80,col:'7B3F00'});
        for(var ci=0;ci<cbKeys.length;ci++){
          c+=wP(cbKeys[ci]+':',{b:true,sb:120,sa:40,hi:true});
          c+=wP(cbs[cbKeys[ci]],{sb:40,sa:80,hi:true});
        }
      }
    }
    c+=wL();
    var dX='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+c+'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>';
    var sX='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:jc w:val="both"/><w:spacing w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>';
    var cT='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
    var pR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    var wR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var zip=new JSZip();
    zip.file('[Content_Types].xml',cT);
    zip.folder('_rels').file('.rels',pR);
    zip.folder('word').file('document.xml',dX);
    zip.folder('word').file('styles.xml',sX);
    zip.folder('word/_rels').file('document.xml.rels',wR);
    var blob=await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    var fecha=new Date().toLocaleDateString('es-AR').replace(/\//g,'-');
    var nom=v('nom-arch')||(v('loc2-n').replace(/\s+/g,'_')+'_'+fecha);
    a.href=url; a.download=nom.endsWith('.docx')?nom:nom+'.docx';
    document.body.appendChild(a); a.click();
    setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},200);
    savH();
  } catch(err){
    console.error('genWord error:',err);
    alert('Error al generar: '+err.message);
  }
}

// ─── HISTORIAL ────────────────────────────────────────────
function savH(){
  var h=JSON.parse(localStorage.getItem('roh')||'[]');
  h.unshift({id:Date.now(),t:TIPO,l2:v('loc2-n'),l:v('loc-n'),dir:v('dir')+', '+v('ciudad'),ini:v('fi')?new Date(v('fi')+'T00:00:00').toLocaleDateString('es-AR'):'',alq:v('alq'),f:new Date().toLocaleString('es-AR')});
  if(h.length>100) h.pop();
  localStorage.setItem('roh',JSON.stringify(h));
  updHC();
}
var TI={casa:'🏠',country:'🛡️',depto:'🏢',estrenar:'⭐',local:'🏪'};
function renderH(){
  var h=JSON.parse(localStorage.getItem('roh')||'[]');
  var lst=document.getElementById('hlst');
  if(!h.length){lst.innerHTML='<div class="emp">Todavia no generaste ningun contrato.</div>';return;}
  var html='';
  for(var i=0;i<h.length;i++){
    var item=h[i];
    html+='<div class="hi"><div class="hi-ico">'+(TI[item.t]||'📄')+'</div><div class="hi-info"><strong>'+item.l2+' - '+item.dir+'</strong><span>Locador: '+item.l+' | Inicio: '+item.ini+' | $'+item.alq+' | '+item.f+'</span></div><button class="btn btnd" style="font-size:11px;padding:3px 8px" onclick="APP.delH('+item.id+')">X</button></div>';
  }
  lst.innerHTML=html;
}
function delH(id){
  var h=JSON.parse(localStorage.getItem('roh')||'[]');
  var nh=[];for(var i=0;i<h.length;i++){if(h[i].id!==id) nh.push(h[i]);}
  localStorage.setItem('roh',JSON.stringify(nh));
  renderH(); updHC();
}
function borrarH(){
  if(!confirm('Borrar todo el historial?')) return;
  localStorage.removeItem('roh'); renderH(); updHC();
}
function updHC(){
  var h=JSON.parse(localStorage.getItem('roh')||'[]');
  var e=document.getElementById('hcnt');
  e.textContent=h.length||''; e.style.display=h.length?'inline':'none';
}

// ─── INIT ─────────────────────────────────────────────────
updHC();
addG();

return {
  showPg:showPg, setModo:setModo, selT:selT, setG:setG,
  addG:addG, remG:remG, onTG:onTG, togCb:togCb, togAll:togAll,
  togVenta:togVenta, updBaja:updBaja, calcV:calcV, calcP:calcP,
  chg:chg, limpiar:limpiar, procAnt:procAnt, genWord:genWord,
  renderH:renderH, delH:delH, borrarH:borrarH,
  addLoc:addLoc, remLoc:remLoc
};

})();
