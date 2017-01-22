(function () {

    angular
        .module('app')
        .controller('SimpleLoginController', SimpleLoginController);

    SimpleLoginController.$inject = ['$timeout', '$state'];

    function SimpleLoginController($timeout, $state) {
        var vm = this;
        vm.passcode = []; 
        vm.numbers = [
            { id: "1", text: "one" },
            { id: "2", text: "two" },
            { id: "3", text: "three" },
            { id: "4", text: "four" },
            { id: "5", text: "five" },
            { id: "6", text: "six" },
            { id: "7", text: "seven" },
            { id: "8", text: "eight" },
            { id: "9", text: "nine" },
            { id: "0", text: "zero" },
        ];
        vm.smallCircles = [false, false,false, false, false, false];


        vm.ClickedCircle = clickedCircle;
        vm.DeletePasscode = deletePasscode;

        function clickedCircle(id) {
            vm[id] = true;
            $timeout(function () {
                vm[id] = false; 
            }, 200);
          
            saveNumber(id);           
            colorSmallCircle();
            checkPasscodeLength(); 
        }

        function saveNumber(id) {          
            for(var i in vm.numbers) {
                if (vm.numbers[i].text === id) {
                    vm.passcode.push(vm.numbers[i].id);                  
                    break; 
                }
            }
        }

        function colorSmallCircle() {
            var length = vm.passcode.length - 1;
            vm.smallCircles[length] = true;

        }

        function loginUser(callback) {
            callback("Error", null);
        }

        function checkPasscodeLength() {
            if (vm.passcode.length == 6) {
                loginUser(function (err, res) {
                    if (err) {
                        console.log(err);
                        vm.passcode = [];
                        $timeout(function () {
                            for (var i in vm.smallCircles) {
                                vm.smallCircles[i] = false;
                            }
                        }, 300);
                    }
                    
                    if (res) {
                        $state.go("root.login");
                    }
                });           
            }   
        }

        function deletePasscode() {
            var index = vm.passcode.length - 1;
            vm.smallCircles[index] = false;
            vm.passcode.splice(index, 1); 
        }


    }



})(); 