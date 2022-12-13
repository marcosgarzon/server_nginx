# SERVIDOR NGINX 
     
Desafío de clase 30 - CODERHOUSE      
  
NGINX  
  
start nginx   
  
nginx -s reload  
  
nginx -s stop  
  
nginx -s quit   
  
---  
  
PM2  
  
pm2 start app2.js --watch (Modo Fork)  
  
pm2 start app2.js -i max --watch  (Modo Cluster)   
  
pm2 delete app.js all // pm2 delete app2.js all  
  
pm2 restart app.js     
  
pm2 monit   
  
---  
  
nodemon app.js (Modo Fork)  
  
nodemon app.js --mode CLUSTER (Modo Cluster)  
  
  
# RUTAS:    
  
http://localhost:8080/info    
  
http://localhost:8080/api/random?cant=1245574  (ingresar número aleatoreo despues de "cant=" de lo contrario por defecto será 100.000.000 )    
  
# NOTA:    
  
No se incluye el archivo .env en el .gitignore ya que no contiene información sensible y de este modo solo descargando el proyecto ya pueda correrlo con npm i + npm run dev argumento1 agumento2    
 
