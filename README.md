# React & Node.js(Express) & Socket.io를 이용한 채팅 서비스 - Server
시작 : 22.10.16  
종료 : 22.10.21  
배포 주소 : https://daegom.com/Node-js-Socket-io-Client  
  
# Stack
1. Express  
2. Socket.io  
3. Cors  
4. env-cmd  
5. nodemon  
  
# 배포 (헤로쿠 명령어)
헤로쿠(Heroku)  

```console
# 헤로쿠 버전 확인 (설치 확인)
heroku -v 

# 헤로쿠 로그인
heroku login

# 프로젝트 생성
heroku create {프로젝트 이름}
git remote -v (헤로쿠 브런치 체크)

# 서버 배포 (deploy)
git push heroku master

# 로그 확인
heroku logs

# 배포 확인
heroku open

# socket io의 경우 (session affinity, mulitiple-nodes 활성화)
heroku features:enable http-session-affinity
```

# 서버 주소
```console
https://{프로젝트 이름}.herokuapp.com/{url}
```