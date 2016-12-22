"use strict";function LoginController(a,b,c,d){var e=this;e.user={},e.errors={},e.fnLogin=function(d){e.submitted=!0,d.$valid&&b.login({email:e.user.email,password:e.user.password}).then(function(){c.path("/contacts")})["catch"](function(b){a.errors.other=b.message})},e.fnLoginOauth=function(a){d.location.href="/auth/"+a}}function RegisterController(a,b,c,d){var e=this;e.user={},e.errors={},e.fnRegister=function(d){e.submitted=!0,d.$valid&&b.createUser({name:e.user.name,email:e.user.email,password:e.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,e.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})},e.fnLoginOauth=function(a){d.location.href="/auth/"+a}}function ContactsModalController(a,b,c){var d=this;d.contactsArray=b,d.currentUser=c,d.fnCloseModal=function(){a.cancel()}}function SettingsController(a,b,c){var d=this;d.errors={},d.currentUser=b.getCurrentUser(),d.fnGetUsers=function(){d.isUserLoading=!0,b.isLoggedInAsync(function(c){c&&b.isAdmin()&&a.query(function(a){d.usersArray=a,d.isUserLoading=!1},function(a){})})},d.fnUpdateUser=function(){a.update(d.currentUser,function(a){},function(a){})},d.fnChangePassword=function(){d.submitted=!0,console.log(d.currentUser),b.changePassword(d.currentUser.oldPassword,d.currentUser.newPassword).then(function(a){console.log(a),d.message="Password successfully changed."})["catch"](function(a){changePassword.password.$setValidity("mongoose",!1),d.errors.other="Incorrect password",d.message=""})},d.fnDeleteUser=function(b,e){var f=c.confirm().title("Would you like to delete this contact ?").ariaLabel("DELETE").targetEvent(b).ok("DELETE").cancel("CANCEL");c.show(f).then(function(){a.remove({id:e},function(){d.fnGetUsers()},function(){})})},d.fnOpenContactModal=function(e){b.isLoggedInAsync(function(b){b&&a.getContacts({id:e._id},function(a){d.contactsArray=a,c.show({templateUrl:"/app/account/settings/contactsModal/contctsModal.html",controller:"ContactsModalCtrl",controllerAs:"contactModal",locals:{contacts:d.contactsArray,user:e}})})})},d.fnOpenUserEditModal=function(a){b.isLoggedInAsync(function(b){b&&c.show({templateUrl:"/app/account/settings/userEditModal/userEditModal.html",controller:"UserEditModalCtrl",controllerAs:"userEdit",locals:{user:angular.copy(a)}}).then(function(){d.fnGetUsers()})})},d.fnInitSettings=function(){d.fnGetUsers()}}function UserEditModalController(a,b,c){var d=this;d.currentUser=a,d.fnCloseModal=function(){b.cancel()},d.fnUpdateUser=function(){c.update(d.currentUser,function(){b.hide()})}}function ContactController(a,b,c,d){var e=this;e.contact=d,e.fnCloseModal=function(){a.cancel()},e.fnSaveContact=function(){e.contact._id?b.update(e.contact,function(){e.fnCloseModal()},function(){e.fnCloseModal()}):(e.contact.userId=c._id,b.save(e.contact,function(){e.fnCloseModal()}))}}function ContactController(a,b,c,d,e){var f=this;f.currentUser=b.getCurrentUser(),f.fnAddContactModal=function(a){c.show({templateUrl:"/app/contacts/contact/contact.html",controller:"ContactCtrl",controllerAs:"cont",locals:{user:f.currentUser,contact:angular.copy(a)}})},f.fnDeleteContact=function(a,b){var d=c.confirm().title("Would you like to delete this contact ?").ariaLabel("DELETE").targetEvent(a).ok("DELETE").cancel("CANCEL");c.show(d).then(function(){e.remove({id:b},function(){},function(){})})},f.fnInitContacts=function(){b.isLoggedInAsync(function(b){b&&a.getContacts({id:f.currentUser._id},function(a){f.contactsArray=a,d.syncUpdates("contacts",f.contactsArray)})})},f.fnInit=function(){f.fnInitContacts()}}function Contacts(a){return a("/api/contacts/:id/:controller",{id:"@_id"},{get:{method:"GET",params:{id:"me"}},update:{method:"PUT"}})}angular.module("testfullstackApp",["ngCookies","ngResource","ngSanitize","ngAnimate","ngMessages","btford.socket-io","ui.router","ngMaterial"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){b.otherwise("/login"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(c){d.authenticate&&!c&&(a.preventDefault(),b.path("/login")),!d.authenticate&&c&&b.path("/contacts")})})}]),angular.module("testfullstackApp").config(["$stateProvider",function(a){a.state("main.login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl",controllerAs:"login",authenticate:!1}).state("main.register",{url:"/register",templateUrl:"app/account/register/register.html",controller:"RegisterCtrl",controllerAs:"register",authenticate:!1}).state("main.settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",controllerAs:"settings",authenticate:!0})}]),angular.module("testfullstackApp").controller("LoginCtrl",LoginController),LoginController.$inject=["$scope","Auth","$location","$window"],angular.module("testfullstackApp").controller("RegisterCtrl",RegisterController),RegisterController.$inject=["$scope","Auth","$location","$window"],angular.module("testfullstackApp").controller("ContactsModalCtrl",ContactsModalController),ContactsModalController.$inject=["$mdDialog","contacts","user"],angular.module("testfullstackApp").controller("SettingsCtrl",SettingsController),SettingsController.$inject=["User","Auth","$mdDialog"],angular.module("testfullstackApp").controller("UserEditModalCtrl",UserEditModalController),UserEditModalController.$inject=["user","$mdDialog","User"],angular.module("testfullstackApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("testfullstackApp").config(["$stateProvider",function(a){a.state("main.admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("testfullstackApp").controller("ContactCtrl",ContactController),ContactController.$inject=["$mdDialog","Contacts","user","contact"],angular.module("testfullstackApp").controller("ContactsCtrl",ContactController),ContactController.$inject=["User","Auth","$mdDialog","socket","Contacts"],angular.module("testfullstackApp").config(["$stateProvider",function(a){a.state("main.contacts",{url:"/contacts",templateUrl:"app/contacts/contacts.html",controller:"ContactsCtrl",controllerAs:"contacts",authenticate:!0})}]),angular.module("testfullstackApp").factory("Contacts",Contacts),Contacts.$inject=["$resource"],angular.module("testfullstackApp").controller("MainCtrl",["$mdSidenav","$mdDialog","$scope","$location","Auth",function(a,b,c,d,e){c.isLoggedIn=e.isLoggedIn,c.isAdmin=e.isAdmin,c.getCurrentUser=e.getCurrentUser,c.logout=function(){e.logout(),d.path("/login")},c.isActive=function(a){return a===d.path()},c.fnToggleLeft=function(){a("left").toggle()};var f;c.openMenu=function(a,b){f=b,a(b)},c.notificationsEnabled=!0,c.toggleNotifications=function(){c.notificationsEnabled=!c.notificationsEnabled},c.redial=function(){b.show(b.alert().targetEvent(f).clickOutsideToClose(!0).parent("body").title("Suddenly, a redial").content("You just called a friend; who told you the most amazing story. Have a cookie!").ok("That was easy")),f=null},c.checkVoicemail=function(){},c.showAddDialog=function(a){var c=angular.element(document.body);b.show({parent:c,targetEvent:a,templateUrl:"components/shell/dialog/dialog.html",controller:"DialogController"})}}]),angular.module("testfullstackApp").config(["$stateProvider",function(a){a.state("main",{url:"","abstract":!0,authenticate:!0,templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("testfullstackApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("testfullstackApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}},update:{method:"PUT"},getContacts:{method:"GET",params:{controller:"contacts"},isArray:!0}})}]),angular.module("testfullstackApp").directive("fileModel",["$parse",function(a){return{restrict:"A",link:function(b,c,d){var e=a(d.fileModel),f=e.assign;c.bind("change",function(){b.$apply(function(){f(b,c[0].files[0])})})}}}]),angular.module("testfullstackApp").directive("passwordVerify",function(){return{require:"ngModel",scope:{passwordVerify:"="},link:function(a,b,c,d){a.$watch(function(){var b;return(a.passwordVerify||d.$viewValue)&&(b=a.passwordVerify+"_"+d.$viewValue),b},function(b){b&&d.$parsers.unshift(function(b){var c=a.passwordVerify;return c!==b?void d.$setValidity("passwordVerify",!1):(d.$setValidity("passwordVerify",!0),b)})})}}}),angular.module("testfullstackApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("testfullstackApp").controller("DialogController",["$scope","$mdDialog","$http",function(a,b,c){a.closeDialog=function(){b.hide()},a.addThing=function(){""!==a.newThing&&(c.post("/api/things",{name:a.newThing}),a.newThing="",b.hide())}}]),angular.module("testfullstackApp").controller("ShellCtrl",["$mdSidenav","$mdDialog","$scope","$location","Auth",function(a,b,c,d,e){c.isLoggedIn=e.isLoggedIn,c.isAdmin=e.isAdmin,c.getCurrentUser=e.getCurrentUser,c.logout=function(){e.logout(),d.path("/login")},c.isActive=function(a){return a===d.path()},c.toggleLeft=function(){a("left").toggle()};var f;c.openMenu=function(a,b){f=b,a(b)},c.notificationsEnabled=!0,c.toggleNotifications=function(){c.notificationsEnabled=!c.notificationsEnabled},c.redial=function(){b.show(b.alert().targetEvent(f).clickOutsideToClose(!0).parent("body").title("Suddenly, a redial").content("You just called a friend; who told you the most amazing story. Have a cookie!").ok("That was easy")),f=null},c.checkVoicemail=function(){},c.showAddDialog=function(a){var c=angular.element(document.body);b.show({parent:c,targetEvent:a,templateUrl:"components/shell/dialog/dialog.html",controller:"DialogController"})}}]),angular.module("testfullstackApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]),angular.module("testfullstackApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<md-content class=md-padding><md-card class="login-card card-width"><md-toolbar class=md-hue-1 layout-align="center center"><div class=md-headline>Login</div></md-toolbar><md-card-content><!--<p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p>--><!--<p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p>--><form name=form ng-submit=login.fnLogin(form) novalidate><div layout=column><md-input-container><label>Email</label><input required type=email name=email ng-model=login.user.email><div ng-messages=form.email.$error><div ng-message=required>This is required.</div><div ng-message=email>Enter valid email address</div></div></md-input-container><md-input-container><label>Password</label><input type=password name=password ng-model=login.user.password><!--pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"--><div ng-messages=form.password.$error><div ng-message=required>This is required.</div><div ng-message=pattern>Password pattern not satisfied</div></div></md-input-container><div layout=row layout-align="end center"><md-button class="md-raised md-primary md-hue-1" type=submit>Login</md-button><md-button type=submit class=md-raised ui-sref=main.register>Register</md-button></div></div></form></md-card-content></md-card></md-content><!-- <div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Login</h1>\n      <p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p>\n      <p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="login(form)" novalidate>\n\n        <div class="form-group">\n          <label>Email</label>\n\n          <input type="email" name="email" class="form-control" ng-model="user.email" required>\n        </div>\n\n        <div class="form-group">\n          <label>Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="user.password" required>\n        </div>\n\n        <div class="form-group has-error">\n          <p class="help-block" ng-show="form.email.$error.required && form.password.$error.required && submitted">\n             Please enter your email and password.\n          </p>\n          <p class="help-block" ng-show="form.email.$error.email && submitted">\n             Please enter a valid email.\n          </p>\n\n          <p class="help-block">{{ errors.other }}</p>\n        </div>\n\n        <div>\n          <button class="btn btn-inverse btn-lg btn-login" type="submit">\n            Login\n          </button>\n          <a class="btn btn-default btn-lg btn-register" href="/signup">\n            Register\n          </a>\n        </div>\n\n        <hr>\n        <div>\n          <a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')">\n            <i class="fa fa-facebook"></i> Connect with Facebook\n          </a>\n          <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')">\n            <i class="fa fa-google-plus"></i> Connect with Google+\n          </a>\n          <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')">\n            <i class="fa fa-twitter"></i> Connect with Twitter\n          </a>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div> -->'),a.put("app/account/register/register.html",'<md-content class=md-padding><md-card class=register-card><md-toolbar layout-align="center center" class=md-hue-1><div class=md-headline>Register</div></md-toolbar><md-card-content><form name=form ng-submit=register.fnRegister(form) novalidate><div layout=column><md-input-container><label>Name</label><input required name=name ng-model=register.user.name><div ng-messages=form.name.$error><div ng-message=required>This is required.</div></div></md-input-container><md-input-container><label>Email</label><input required name=email type=email ng-model=register.user.email><div ng-messages=form.email.$error><div ng-message=required>This is required.</div><div ng-message=email>Enter valid email address</div></div></md-input-container><md-input-container><label>Password</label><input required type=password name=password pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" ng-model=register.user.password><div ng-messages=form.password.$error><div ng-message=required>This is required.</div><div ng-message=pattern>Password pattern not satisfied</div></div></md-input-container><md-input-container><label>Re-Type Password</label><input required type=password password-verify=register.user.password name=c_password ng-model=register.user.c_password><div ng-messages=form.c_password.$error><div ng-message=required>This is required.</div><div ng-message=passwordVerify>Password must match.</div></div></md-input-container><div layout=row layout-align="end center"><md-button class="md-raised md-primary md-hue-1" type=submit>Sign up</md-button><md-button type=submit class=md-raised ui-sref=main.login>Login</md-button></div></div></form></md-card-content></md-card></md-content><!-- <div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Sign up</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="register(form)" novalidate>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }">\n          <label>Name</label>\n\n          <input type="text" name="name" class="form-control" ng-model="user.name"\n                 required/>\n          <p class="help-block" ng-show="form.name.$error.required && submitted">\n            A name is required\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }">\n          <label>Email</label>\n\n          <input type="email" name="email" class="form-control" ng-model="user.email"\n                 required\n                 mongoose-error/>\n          <p class="help-block" ng-show="form.email.$error.email && submitted">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class="help-block" ng-show="form.email.$error.required && submitted">\n            What\'s your email address?\n          </p>\n          <p class="help-block" ng-show="form.email.$error.mongoose">\n            {{ errors.email }}\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }">\n          <label>Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="user.password"\n                 ng-minlength="3"\n                 required\n                 mongoose-error/>\n          <p class="help-block"\n             ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">\n            Password must be at least 3 characters.\n          </p>\n          <p class="help-block" ng-show="form.password.$error.mongoose">\n            {{ errors.password }}\n          </p>\n        </div>\n\n        <div>\n          <button class="btn btn-inverse btn-lg btn-login" type="submit">\n            Sign up\n          </button>\n          <a class="btn btn-default btn-lg btn-register" href="/login">\n            Login\n          </a>\n        </div>\n\n        <hr>\n        <div>\n          <a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')">\n            <i class="fa fa-facebook"></i> Connect with Facebook\n          </a>\n          <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')">\n            <i class="fa fa-google-plus"></i> Connect with Google+\n          </a>\n          <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')">\n            <i class="fa fa-twitter"></i> Connect with Twitter\n          </a>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div> -->'),a.put("app/account/settings/contactsModal/contctsModal.html",'<md-dialog class=halfScreen><md-toolbar><div class=md-toolbar-tools layout=row layout-align="space-between center"><div ng-bind=contactModal.currentUser.name></div><md-button aria-label=close class="md-icon-button m-t-10" ng-click=contactModal.fnCloseModal()><md-icon md-font-set="fa fa-lg fa-close"></md-icon></md-button></div></md-toolbar><md-content><md-list><md-list-item class=md-2-line ng-repeat="contact in contactModal.contactsArray"><div class=md-list-item-text><div ng-bind=contact.name></div><p ng-bind=contact.email></p><p ng-bind=contact.phone></p></div><md-divider></md-divider></md-list-item><h3 layout=column layout-align="center center" ng-if="contactModal.contactsArray.length == 0">No Contacts to Display</h3></md-list></md-content></md-dialog>'),a.put("app/account/settings/settings.html",'<md-content ng-init=settings.fnInitSettings()><div layout-padding layout=row layout-xs=column><div flex><md-card><md-toolbar class=md-hue-1><div class=md-toolbar-tools>Edit Profile</div></md-toolbar><md-content layout-padding><form name=updateForm novalidate><div layout=column><md-input-container><md-icon md-font-set="fa fa-lg fa-user" class="md-primary md-hue-1"></md-icon><label>Name</label><input required name=name ng-model=settings.currentUser.name><div ng-messages=updateForm.name.$error><div ng-message=required>This field is required</div></div></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-envelope" class="md-primary md-hue-1"></md-icon><label>email</label><input type=email name=email ng-model=settings.currentUser.email disabled></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-briefcase" class="md-primary md-hue-1"></md-icon><label>Role</label><input name=role ng-model=settings.currentUser.role disabled></md-input-container><div layout=row layout-align="end center"><md-button class="md-primary md-raised" ng-click="updateForm.$valid && settings.fnUpdateUser();">Save</md-button><md-button class=md-raised>Cancel</md-button></div></div></form></md-content></md-card></div><div flex><md-card><md-toolbar class=md-hue-1><div class=md-toolbar-tools>Change Password</div></md-toolbar><md-content layout-padding><form name=changePassword novalidate><div layout=column><md-input-container><md-icon md-font-set="fa fa-lg fa-lock" class="md-primary md-hue-1"></md-icon><label>Current Password</label><input required type=password name=oldPassword ng-model=settings.currentUser.oldPassword mongoose-error><div ng-messages=changePassword.oldPassword.$error><div ng-message=required>This field is required</div></div></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-key" class="md-primary md-hue-1"></md-icon><label>New Password</label><input required type=password name=newPassword ng-model=settings.currentUser.newPassword></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-key" class="md-primary md-hue-1"></md-icon><label>Re-type New Password</label><input required type=password name=newPassword_c ng-model=settings.currentUser.newPassword_c password-verify=settings.currentUser.newPassword></md-input-container><div layout=row layout-align="end center"><md-button class="md-primary md-raised" ng-click=settings.fnChangePassword();>Save</md-button><md-button class=md-raised>Cancel</md-button></div></div></form></md-content></md-card></div></div><div flex ng-if="settings.currentUser.role == \'admin\'"><md-toolbar><div class=md-toolbar-tools>Users</div></md-toolbar><md-content><md-list layout-padding><md-list-item class=md-3-line ng-repeat="user in settings.usersArray"><div class=md-list-item-text><div>Name:<span ng-bind=user.name></span></div><p>Eamil: <span ng-bind=user.email></span></p><p>Role: <span ng-bind=user.role></span></p></div><div class=md-secondary><md-icon md-font-set="fa fa-lg fa-book" class=md-primary ng-click=settings.fnOpenContactModal(user)><md-tooltip md-direction=bottom>view contacts</md-tooltip></md-icon><md-icon md-font-set="fa fa-lg fa-pencil m-t-5" class=md-primary ng-click=settings.fnOpenUserEditModal(user)><md-tooltip md-direction=bottom>Edit</md-tooltip></md-icon><md-icon md-font-set="fa fa-lg fa-trash m-t-5" class=md-warn ng-click=settings.fnDeleteUser($event,user._id)><md-tooltip md-direction=bottom>Delete</md-tooltip></md-icon></div><md-divider></md-divider></md-list-item></md-list></md-content></div></md-content><!--\n<md-toolbar class="md-hue-1">\n  <div class="md-toolbar-tools">\n    Settings\n  </div>\n</md-toolbar>\n<md-content>\n  <div class="container">\n    <div class="row">\n      <div class="col-sm-12">\n        <h1>Change Password</h1>\n      </div>\n      <div class="col-sm-12">\n        <form class="form" name="form" ng-submit="fnChangePassword(form)" novalidate>\n\n          <div class="form-group">\n            <label>Current Password</label>\n\n            <input type="password" name="password" class="form-control" ng-model="user.oldPassword"\n                   mongoose-error/>\n            <p class="help-block" ng-show="form.password.$error.mongoose">\n              {{ errors.other }}\n            </p>\n          </div>\n\n          <div class="form-group">\n            <label>New Password</label>\n\n            <input type="password" name="newPassword" class="form-control" ng-model="user.newPassword"\n                   ng-minlength="3"\n                   required/>\n            <p class="help-block"\n               ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">\n              Password must be at least 3 characters.\n            </p>\n          </div>\n\n          <p class="help-block"> {{ message }} </p>\n\n          <button class="btn btn-lg btn-primary" type="submit">Save changes</button>\n        </form>\n      </div>\n    </div>\n  </div>\n</md-content>\n-->'),a.put("app/account/settings/userEditModal/userEditModal.html",'<md-dialog class=halfScreen><md-toolbar><div class=md-toolbar-tools layout=row layout-align="space-between center"><div>{{userEdit.currentUser.name}}</div><md-button aria-label=close class=md-icon-button ng-click=userEdit.fnCloseModal()><md-icon md-font-set="fa fa-lg fa-close" class=m-t-5></md-icon></md-button></div></md-toolbar><md-content layout-padding><form name=editUser><div layout=column><md-input-container><label>Name</label><md-icon md-font-set="fa fa-lg fa-user" class=md-primary></md-icon><input ng-model=userEdit.currentUser.name></md-input-container><md-input-container><label>Email</label><md-icon md-font-set="fa fa-lg fa-envelope" class=md-primary></md-icon><input type=email ng-model=userEdit.currentUser.email></md-input-container><md-input-container><label>Role</label><md-icon md-font-set="fa fa-lg fa-briefcase" class=md-primary></md-icon><md-select ng-model=userEdit.currentUser.role><md-option value=user>User</md-option><md-option value=guest>Guest</md-option></md-select></md-input-container><div layout=row layout-align="end center"><md-button class="md-raised md-primary" ng-click=userEdit.fnUpdateUser()>Update</md-button><md-button ng-click=userEdit.fnCloseModal()>Cancel</md-button></div></div></form></md-content></md-dialog>'),a.put("app/admin/admin.html",'<div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/contacts/contact/contact.html",'<md-dialog class=halfScreen><md-toolbar class="md-primary md-hue-1"><div class=md-toolbar-tools layout=row layout-align="space-between center"><div ng-bind="cont.contact._id ? \'Update Contact\': \'Add Contact\'"></div><md-button aria-label=close class="md-icon-button m-t-10" ng-click=cont.fnCloseModal()><md-icon md-font-set="fa fa-lg fa-close"></md-icon></md-button></div></md-toolbar><md-content layout-padding><form name=contactForm novalidate><div layout=column><md-input-container><md-icon md-font-set="fa fa-lg fa-user m-t-5" class="md-primary md-hue-1"></md-icon><label>Name</label><input required name=name ng-model=cont.contact.name><div ng-messages=contactForm.name.$error><div ng-message=required>This field is required</div></div></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-envelope m-t-5" class="md-primary md-hue-1"></md-icon><label>Email</label><input required name=email type=email ng-model=cont.contact.email><div ng-messages=contactForm.email.$error><div ng-message=required>This field is required</div></div></md-input-container><md-input-container><md-icon md-font-set="fa fa-lg fa-phone m-t-5" class="md-primary md-hue-1"></md-icon><label>Phone</label><input required type=number name=phone ng-model=cont.contact.phone><div ng-messages=contactForm.phone.$error><div ng-message=required>This field is required</div></div></md-input-container><div layout=row layout-align="end center"><md-button aria-label="Save Contact" class="md-raised md-primary" type=submit ng-click="contactForm.$valid && cont.fnSaveContact()"><label ng-bind="cont.contact._id ? \'Update\':\'Save\'"></label></md-button><md-button class=md-raised ng-click=cont.fnCloseModal()><label>Cancel</label></md-button></div></div></form></md-content></md-dialog>'),a.put("app/contacts/contacts.html",'<md-toolbar class=md-hue-1><div class=md-toolbar-tools layout=row layout-align="space-between center"><div>Contacts</div><md-button aria-label="Add Contact" class="md-fab md-mini md-primary" ng-click=contacts.fnAddContactModal()><md-icon md-font-set="fa fa-lg fa-plus m-t-10"></md-icon><md-tooltip md-direction=bottom>Add Contact</md-tooltip></md-button></div></md-toolbar><md-content ng-init=contacts.fnInit() layout-margin><md-list><md-list-item class=md-2-line ng-repeat="contact in contacts.contactsArray"><div class=md-list-item-text><div ng-bind=contact.name></div><p ng-bind=contact.email></p><p ng-bind=contact.phone></p></div><div class=md-secondary layout=row><div ng-click=contacts.fnAddContactModal(contact)><md-icon md-font-set="fa fa-lg fa-pencil" class=md-primary></md-icon><md-tooltip md-direction=bottom>Edit</md-tooltip></div><div><md-icon md-font-set="fa fa-lg fa-trash" class=md-warn ng-click=contacts.fnDeleteContact($event,contact._id)></md-icon><md-tooltip md-direction=bottom>Delete</md-tooltip></div></div><md-divider></md-divider></md-list-item></md-list></md-content>'),a.put("app/main/main.html",'<div layout=column><md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id=left><md-toolbar class="md-tall md-accent"><div layout=column layout-padding class=profile-container><div flex></div><div layout-padding layout=column><div class=profile-name>{{ getCurrentUser().name }}</div><div class=profile-email>{{ getCurrentUser().email }}</div></div></div></md-toolbar><md-content><md-list ng-click=fnToggleLeft()><md-list-item ui-sref=main.contacts ui-sref-active=active><md-icon md-font-set="fa fa-lg fa-book"></md-icon><p>Contacts</p></md-list-item></md-list></md-content></md-sidenav><md-toolbar><div class=md-toolbar-tools><md-button ng-if=isLoggedIn() ng-click=fnToggleLeft() class=md-icon-button aria-label=Settings><md-icon md-svg-icon=assets/icons/fe6be280.menu.svg></md-icon></md-button><h2><span>Demo fullstack</span></h2><span flex=""></span><md-menu><md-button ng-show=isLoggedIn() aria-label="Open phone interactions menu" class=md-icon-button ng-click="openMenu($mdOpenMenu, $event)"><md-icon md-menu-origin md-svg-icon=assets/icons/c1074e00.dots-vertical.svg></md-icon></md-button><md-menu-content width=3><md-menu-item><md-button ui-sref=main.settings><md-icon md-font-set="fa fa-lg fa-cog"></md-icon>Settings</md-button></md-menu-item><md-menu-item ng-show=isLoggedIn()><md-button ng-click=logout()><md-icon md-font-set="fa fa-lg fa-power-off"></md-icon>Logout</md-button></md-menu-item></md-menu-content></md-menu></div></md-toolbar><ui-view layout=column layout-fill></ui-view></div>'),
a.put("components/shell/dialog/dialog.html",'<md-dialog aria-label="List dialog"><md-dialog-content><h2 class=md-title>Set a description for the new thing</h2><form name=projectForm><md-input-container><label>Description</label><input md-maxlength=30 required name=description ng-model=newThing><div ng-messages=projectForm.description.$error><div ng-message=required>This is required.</div><div ng-message=md-maxlength>The name has to be less than 30 characters long.</div></div></md-input-container></form></md-dialog-content><div class=md-actions><md-button ng-click=closeDialog() class=md-primary>Cancel</md-button><md-button ng-click=addThing() class=md-primary>Save</md-button></div></md-dialog>'),a.put("components/shell/shell.html",'<div ng-controller=MainCtrl class=main-shell><md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id=left><md-toolbar class="md-tall md-accent"><div layout=column layout-padding class=profile-container><div flex></div><div layout-padding layout=column><div class=profile-name>{{ getCurrentUser().name }}</div><div class=profile-email>{{ getCurrentUser().email }}</div></div></div></md-toolbar><md-content layout-padding></md-content></md-sidenav><md-toolbar><div class=md-toolbar-tools><md-button ng-click=toggleLeft() class=md-icon-button aria-label=Settings><md-icon md-svg-icon=assets/icons/fe6be280.menu.svg></md-icon></md-button><h2><span>testfullstack</span></h2><span flex=""></span><md-menu><md-button aria-label="Open phone interactions menu" class=md-icon-button ng-click="openMenu($mdOpenMenu, $event)"><md-icon md-menu-origin md-svg-icon=assets/icons/c1074e00.dots-vertical.svg></md-icon></md-button><md-menu-content width=4><md-menu-item><md-button ng-click=showAddDialog($event)><md-icon md-svg-icon=content:add md-menu-align-target></md-icon>Add</md-button></md-menu-item><md-menu-item><md-button ng-click=redial($event)><md-icon md-svg-icon=communication:dialpad md-menu-align-target></md-icon>Redial</md-button></md-menu-item><md-menu-item><md-button disabled ng-click=checkVoicemail()><md-icon md-svg-icon=communication:voicemail></md-icon>Check voicemail</md-button></md-menu-item><md-menu-item><md-button ng-click=toggleNotifications()><md-icon md-svg-icon="social:notifications{{notificationsEnabled ? \'_off\' : \'\'}}"></md-icon>{{notificationsEnabled ? \'Disable\' : \'Enable\' }} notifications</md-button></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item ng-hide=isLoggedIn() ui-sref=login><md-button><md-icon md-svg-icon=action:input></md-icon>Login</md-button></md-menu-item><md-menu-item ng-hide=isLoggedIn() ui-sref=signup><md-button><md-icon md-svg-icon=action:launch></md-icon>Signup</md-button></md-menu-item><md-menu-item ng-show=isLoggedIn()><md-button ng-click=logout()><md-icon md-svg-icon=action:exit_to_app></md-icon>Logout</md-button></md-menu-item></md-menu-content></md-menu></div></md-toolbar></div>')}]);