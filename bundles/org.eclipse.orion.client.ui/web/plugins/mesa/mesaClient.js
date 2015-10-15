define(["require", "exports", "orion/Deferred", "orion/git/gitClient"], function (require, exports, Deferred, mGitClient) {
    // import _ = require("orion/URL-shim");
    // eclipse.MesaService = 4;
    var MesaService;
    (function (MesaService_1) {
        function appendGitStatusResults(changedFiles, gitStatusResults, changeType) {
            gitStatusResults.forEach(function (statusResult) {
                if (Util.ResourceFormatter.hasDataTableExtension(statusResult.Name)) {
                    changedFiles[statusResult.Location] = changeType;
                }
            });
        }
        var MesaService = (function () {
            function MesaService(serviceRegistry) {
                this._serviceRegistry = serviceRegistry;
                this._serviceRegistration = serviceRegistry.registerService("orion.git.provider", this);
            }
            MesaService.prototype.getChangedFileStatus = function (repoLocation) {
                var gitClient = this._serviceRegistry.getService("orion.git.provider");
                if (gitClient === null) {
                    gitClient = new mGitClient.GitService(this._serviceRegistry);
                }
                var deferredResult = new Deferred();
                var gitStatusDeferred = gitClient.getGitStatus("/gitapi/status" + repoLocation);
                // TODO: Don't do this. Look into accessing the credentials stored in Orion's native Git-ness.
                //       It may be necessary to require users to set them up the first time they login
                var gitPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\n"
                    + "MIIEpgIBAAKCAQEAwZFQiiC4LROpB0E8VlFo0tLJyklXvglzZcwagPLF0pOMz3Jd\n"
                    + "Hwj2cIt5M4qnnGhhdMGXUhwrg+h861oj0yV2BDxSD8Jb2mguyeMFB4yv4VOs5CAo\n"
                    + "j80I/u/q8qKyJnHbf3ctTpyegi17bvkfHntvoMcYSpb5QcGyOq9ep0oPjiKSHvc5\n"
                    + "mEa7nHz5FKagOJ74kIhw3BsPfgB519jHX0GaFHuXV3l6nFUJdyMKV1adj52QyVG7\n"
                    + "cUqYm2QJOywQQsMqikebAt02vsEdh9qiEBCnyGnG9bdzNAkNx07dHWL/DNvoDGzf\n"
                    + "mfL1MvKMQmY7rOXhZikjdeRWry+IQ0YXZA+ZWwIDAQABAoIBAQCd5DzADyRskIbm\n"
                    + "Bg6DknBg19QGD4Fk4CyjMrPDz0QSGo1Xgb/32sW60+oPYuCJspMcO/WE4rmUJYYQ\n"
                    + "LDzgtMPpfJKrjCyEoUrZHzcxC09EC48RnjG36tWVrnoFZTTQKzuSY9IvN44MPbFb\n"
                    + "uhXqNWG+0eg8n52+R5NsTzR0XPMHSjkbDu7MoKa+3+4OoyjCl4lGCzV2ptvh7pge\n"
                    + "j4f7SaHSZ1Odoc6RDjqj/4sCDD9DoAymynbJX7jJf44ZGHH+ykFKnY3gXF5OAxBH\n"
                    + "EVIwvzZA8ObnRWx0VBtXjHVuLm0YWLka3iYbAGtr24zlqG5fb8RA6pSLnWeuquW/\n"
                    + "PGgTqxvBAoGBAP/cMYM0yeaPip8ltDz0SAODQXlbwHM4HI3zNi5od39YnJuNuQ/K\n"
                    + "EyXQPFv61eyHcYidXcCLsn0kcPw0wuTTeLWmrSoUF7kAyjAwSy1K+USj/b6cjBr0\n"
                    + "Fj6Cfw9jOQmHQ7Ivc8mejBESRE2iUOgRYxwb7Dp9EWidP06rNslXCcSxAoGBAMGs\n"
                    + "Z1NlgtmXtqZLAEJPw6xhAxBbH80kzpURB3AGf6SLxEpn94uIyKDqAD+eC74bIR8n\n"
                    + "aG08M7uuxB9c8SNHPG9A1ljEz43XFvQJQXgctdC6hE2TEH2L1Ecdd8VmtIzzJOh8\n"
                    + "07Cxerlt6OxMyj9e39GTJfb0UCkdnstMLPXhBvHLAoGBAOoeUi/83cJbFj0KAyLD\n"
                    + "ZCHSuNaTXkYP0hERu0I71RxxuNudkvkfruWq5ZBEtfr49KpNVLwbF/fqoHgmzy8T\n"
                    + "UiDlow4d1Jc0Yc42YpPPRsfIRydjl9ASCUipoBo0cLyHSSqCwTB8Iy57yIRBQkcX\n"
                    + "odjWtBHQ310ahhM2F6ukOQwBAoGBAKAJobw1NsItbr3NXiJtnSi1ZX2/fvDayGY/\n"
                    + "kyDMDe/fms1NSi4gUoE9vATVyahG7MC8pLsXMzyUtvWfrJdVRyg7sKPbxhLUOOBh\n"
                    + "QZtKRid76NXdf5Pu1vQI8q7JJssOJGKEu7zXe6z8mKui7MEe2d5pNMbzrcW79zrQ\n"
                    + "8JohX8avAoGBAKVJ8XW+i8l8WVTrxDeAjmt7tXrwE58E7yaWVSosFiWDCaM/WEYq\n"
                    + "hi8HkFo6PRCbcDO11vnw0uBU1MjHMA8rdlUvmvtzzyXh5DzM6WyyqhPyA1udCdo4\n"
                    + "HJVzItVt+ZVvoqV1rBvUPJhKuH33kI1Hk3LkAOt7N7AGsFcC5bs64tFK\n"
                    + "-----END RSA PRIVATE KEY-----\n";
                gitClient.doFetch("/gitapi/remote/origin/master/" + repoLocation, false, null, null, null, gitPrivateKey, null).then(function (response) {
                    gitClient.getGitRemote("/gitapi/remote/origin/master" + repoLocation).then(function (remoteStatus) {
                        var gitDiffDeferred = gitClient.doGitDiff("/gitapi/diff/" + remoteStatus.Id
                            + "..HEAD/" + repoLocation + "?showNameAndStatusOnly=true&parts=diff");
                        Deferred.all([gitStatusDeferred, gitDiffDeferred]).then(function (result) {
                            var changedFiles = {};
                            // initialize with git diff result before adding git status results so status changeType,
                            // which is more recent, overwrites diff change type
                            var diffFilenames = Object.keys(result[1]);
                            for (var i = 0; i < diffFilenames.length; i++) {
                                var filename = diffFilenames[i];
                                if (Util.ResourceFormatter.hasDataTableExtension(filename)) {
                                    changedFiles[repoLocation + filename] = result[1][filename];
                                }
                            }
                            var statusData = result[0];
                            appendGitStatusResults(changedFiles, statusData.Added.concat(statusData.Untracked), OrionGit.ChangeType.ADD);
                            appendGitStatusResults(changedFiles, statusData.Missing.concat(statusData.Removed), OrionGit.ChangeType.DELETE);
                            appendGitStatusResults(changedFiles, statusData.Changed.concat(statusData.Conflicting).concat(statusData.Modified), OrionGit.ChangeType.DELETE);
                            deferredResult.resolve(changedFiles);
                        });
                    });
                });
                return deferredResult;
            };
            MesaService.prototype.getFileReplacements = function (repoLocation) {
                var changedFiles = {};
                var deferredResult = new Deferred();
                this.getChangedFileStatus("repo").then(function (changedFileStatuses) {
                    var fileDeferreds = [];
                    var filenames = [];
                    var fileLocations = Object.keys(changedFileStatuses);
                    for (var i = 0; i < fileLocations.length; i++) {
                        var fileLocation = fileLocations[i];
                        if (changedFileStatuses[fileLocation] === OrionGit.ChangeType.DELETE) {
                            // TODO replace with error
                            changedFiles[Util.ResourceFormatter.fileLocationToId(fileLocation, repoLocation)] = "";
                        }
                        else {
                            // TODO here in TypeScript conversion -- does Typescript support JavaScript URL?
                            // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
                            var url = new URL(fileLocation);
                            fileDeferreds.push(xhr("GET", url.href, {
                                headers: { "Orion-Version": "1" }
                            }));
                            filenames.push(Util.ResourceFormatter.fileLocationToId(fileLocation, repoLocation));
                        }
                    }
                });
                // TODO handle optOnError
                Deferred.all(fileDeferreds).then(function(contents) {
                    if (contents.length !== filenames.length) {
                        // TODO should never happen. Still, handle it
                    }
                    for (var i = 0; i < contents.length; i++) {
                        changedFiles[fileLocations[i]] = contents[i].responseText;
                    }
                    deferredResult.resolve(changedFiles);
                });
                return deferredResult;
            };
            return MesaService;
        })();
        MesaService_1.MesaService = MesaService;
    })(MesaService || (MesaService = {}));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc2FQbHVnaW4vd2ViL3BsdWdpbnMvbWVzYS9tZXNhQ2xpZW50LnRzIl0sIm5hbWVzIjpbIk1lc2FTZXJ2aWNlIiwiTWVzYVNlcnZpY2UuYXBwZW5kR2l0U3RhdHVzUmVzdWx0cyIsIk1lc2FTZXJ2aWNlLk1lc2FTZXJ2aWNlIiwiTWVzYVNlcnZpY2UuTWVzYVNlcnZpY2UuY29uc3RydWN0b3IiLCJNZXNhU2VydmljZS5NZXNhU2VydmljZS5nZXRDaGFuZ2VkRmlsZVN0YXR1cyIsIk1lc2FTZXJ2aWNlLk1lc2FTZXJ2aWNlLmdldEZpbGVSZXBsYWNlbWVudHMiXSwibWFwcGluZ3MiOiI7SUFLQSxBQUlBLHdDQUp3QztJQUV4QywyQkFBMkI7SUFFM0IsSUFBTyxXQUFXLENBc0pqQjtJQXRKRCxXQUFPLGFBQVcsRUFBQyxDQUFDO1FBa0JoQkEsZ0NBQWdDQSxZQUFxQ0EsRUFDN0RBLGdCQUE4Q0EsRUFBRUEsVUFBK0JBO1lBQ25GQyxnQkFBZ0JBLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLFlBQVlBO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsWUFBWSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDLENBQUNBLENBQUNBO1FBQ1BBLENBQUNBO1FBRUREO1lBSUlFLHFCQUFZQSxlQUFpREE7Z0JBQ3pEQyxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLGVBQWVBLENBQUNBO2dCQUN4Q0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxlQUFlQSxDQUFDQSxlQUFlQSxDQUFDQSxvQkFBb0JBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQzVGQSxDQUFDQTtZQUVNRCwwQ0FBb0JBLEdBQTNCQSxVQUE0QkEsWUFBb0JBO2dCQUM1Q0UsSUFBSUEsU0FBU0EsR0FBMkJB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Q0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQzVDLElBQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLEtBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNuRSxBQUNBLDBCQUQwQjs0QkFDMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQzNGLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osQUFNQSxnRkFOZ0Y7NEJBQ2hGLDJEQUEyRDs0QkFDM0QsMkNBQTJDOzRCQUMzQzs7bUNBRU87NEJBQ1AsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ3hGLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDLENBQUNBLENBQUNBO2dCQUVIQSxBQVdBQSx5QkFYeUJBO2dCQUN6QkE7Ozs7Ozs7O3FCQVFLQTtnQkFFTEEsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7WUFDMUJBLENBQUNBO1lBQ0xILGtCQUFDQTtRQUFEQSxDQXpIQUYsQUF5SENFLElBQUFGO1FBekhZQSx5QkFBV0EsY0F5SHZCQSxDQUFBQTtJQUVMQSxDQUFDQSxFQXRKTSxXQUFXLEtBQVgsV0FBVyxRQXNKakIiLCJmaWxlIjoibWVzYVBsdWdpbi93ZWIvcGx1Z2lucy9tZXNhL21lc2FDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcmVxdWlyZSA9IHJlcXVpcmUoXCJyZXF1aXJlXCIpO1xuaW1wb3J0IERlZmVycmVkID0gcmVxdWlyZShcIm9yaW9uL0RlZmVycmVkXCIpO1xuLy8gaW1wb3J0IHhociA9IHJlcXVpcmUoXCJvcmlvbi94aHJcIik7XG5pbXBvcnQgbUdpdENsaWVudCA9IHJlcXVpcmUoXCJvcmlvbi9naXQvZ2l0Q2xpZW50XCIpO1xuXG4vLyBpbXBvcnQgXyA9IHJlcXVpcmUoXCJvcmlvbi9VUkwtc2hpbVwiKTtcblxuLy8gZWNsaXBzZS5NZXNhU2VydmljZSA9IDQ7XG5cbm1vZHVsZSBNZXNhU2VydmljZSB7XG5cbiAgICBpbnRlcmZhY2UgSUZpbGVuYW1lVG9HaXRTdGF0dXNNYXAge1xuICAgICAgICBbZmlsZW5hbWU6IHN0cmluZ106IE9yaW9uR2l0LkNoYW5nZVR5cGU7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRmlsZW5hbWVUb0NvbnRlbnRNYXAge1xuICAgICAgICBbZmlsZW5hbWU6IHN0cmluZ106IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElNZXNhU2VydmljZSBleHRlbmRzIFNlcnZpY2VSZWdpc3RyeS5JU2VydmljZVJlZmVyZW5jZSB7XG4gICAgICAgIC8vIEdldCB0aGUgc3RhdHVzIG9mIGFsbCB0aGUgZmlsZXMgdGhhdCBkaWZmZXIgYmV0d2VlbiB0aGUgbG9jYWwgd29ya2luZyB0cmVlIGFuZCB0aGUgcmVtb3RlLlxuICAgICAgICBnZXRDaGFuZ2VkRmlsZVN0YXR1cyhyZXBvTG9jYXRpb246IHN0cmluZyk6IERlZmVycmVkLklEZWZlcnJlZDtcblxuICAgICAgICAvLyBHZXQgdGhlIGNvbnRlbnRzIG9mIGFsbCBmaWxlcyB0aGF0IGRpZmZlciBiZXR3ZWVuIHRoZSBsb2NhbCB3b3JraW5nIHRyZWUgYW5kIHRoZSByZW1vdGUuXG4gICAgICAgIGdldEZpbGVSZXBsYWNlbWVudHMocmVwb0xvY2F0aW9uOiBzdHJpbmcpOiBEZWZlcnJlZC5JRGVmZXJyZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kR2l0U3RhdHVzUmVzdWx0cyhjaGFuZ2VkRmlsZXM6IElGaWxlbmFtZVRvR2l0U3RhdHVzTWFwLFxuICAgICAgICAgICAgZ2l0U3RhdHVzUmVzdWx0czogT3Jpb25HaXQuU3RhdHVzUmVzdWx0RW50cnlbXSwgY2hhbmdlVHlwZTogT3Jpb25HaXQuQ2hhbmdlVHlwZSk6IHZvaWQge1xuICAgICAgICBnaXRTdGF0dXNSZXN1bHRzLmZvckVhY2goZnVuY3Rpb24oc3RhdHVzUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5SZXNvdXJjZUZvcm1hdHRlci5oYXNEYXRhVGFibGVFeHRlbnNpb24oc3RhdHVzUmVzdWx0Lk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlZEZpbGVzW3N0YXR1c1Jlc3VsdC5Mb2NhdGlvbl0gPSBjaGFuZ2VUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTWVzYVNlcnZpY2UgaW1wbGVtZW50cyBJTWVzYVNlcnZpY2Uge1xuICAgICAgICBwcml2YXRlIF9zZXJ2aWNlUmVnaXN0cnk6IFNlcnZpY2VSZWdpc3RyeS5JU2VydmljZVJlZ2lzdHJ5O1xuICAgICAgICBwcml2YXRlIF9zZXJ2aWNlUmVnaXN0cmF0aW9uOiBTZXJ2aWNlUmVnaXN0cnkuSVNlcnZpY2VSZWdpc3RyYXRpb247XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2VydmljZVJlZ2lzdHJ5OiBTZXJ2aWNlUmVnaXN0cnkuSVNlcnZpY2VSZWdpc3RyeSkge1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZVJlZ2lzdHJ5ID0gc2VydmljZVJlZ2lzdHJ5O1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZVJlZ2lzdHJhdGlvbiA9IHNlcnZpY2VSZWdpc3RyeS5yZWdpc3RlclNlcnZpY2UoXCJvcmlvbi5naXQucHJvdmlkZXJcIiwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2hhbmdlZEZpbGVTdGF0dXMocmVwb0xvY2F0aW9uOiBzdHJpbmcpOiBEZWZlcnJlZC5JRGVmZXJyZWQge1xuICAgICAgICAgICAgdmFyIGdpdENsaWVudCA9IDxHaXRDbGllbnQuSUdpdFNlcnZpY2U+IHRoaXMuX3NlcnZpY2VSZWdpc3RyeS5nZXRTZXJ2aWNlKFwib3Jpb24uZ2l0LnByb3ZpZGVyXCIpO1xuICAgICAgICAgICAgaWYgKGdpdENsaWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdpdENsaWVudCA9IG5ldyBtR2l0Q2xpZW50LkdpdFNlcnZpY2UodGhpcy5fc2VydmljZVJlZ2lzdHJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRlZmVycmVkUmVzdWx0ID0gbmV3IERlZmVycmVkKCk7XG4gICAgICAgICAgICB2YXIgZ2l0U3RhdHVzRGVmZXJyZWQgPSBnaXRDbGllbnQuZ2V0R2l0U3RhdHVzKFwiL2dpdGFwaS9zdGF0dXNcIiArIHJlcG9Mb2NhdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IERvbid0IGRvIHRoaXMuIExvb2sgaW50byBhY2Nlc3NpbmcgdGhlIGNyZWRlbnRpYWxzIHN0b3JlZCBpbiBPcmlvbidzIG5hdGl2ZSBHaXQtbmVzcy5cbiAgICAgICAgICAgIC8vICAgICAgIEl0IG1heSBiZSBuZWNlc3NhcnkgdG8gcmVxdWlyZSB1c2VycyB0byBzZXQgdGhlbSB1cCB0aGUgZmlyc3QgdGltZSB0aGV5IGxvZ2luXG4gICAgICAgICAgICB2YXIgZ2l0UHJpdmF0ZUtleTogc3RyaW5nID0gXCItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIk1JSUVwZ0lCQUFLQ0FRRUF3WkZRaWlDNExST3BCMEU4VmxGbzB0TEp5a2xYdmdselpjd2FnUExGMHBPTXozSmRcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiSHdqMmNJdDVNNHFubkdoaGRNR1hVaHdyZytoODYxb2oweVYyQkR4U0Q4SmIybWd1eWVNRkI0eXY0Vk9zNUNBb1xcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJqODBJL3UvcThxS3lKbkhiZjNjdFRweWVnaTE3YnZrZkhudHZvTWNZU3BiNVFjR3lPcTllcDBvUGppS1NIdmM1XFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIm1FYTduSHo1RkthZ09KNzRrSWh3M0JzUGZnQjUxOWpIWDBHYUZIdVhWM2w2bkZVSmR5TUtWMWFkajUyUXlWRzdcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiY1VxWW0yUUpPeXdRUXNNcWlrZWJBdDAydnNFZGg5cWlFQkNueUduRzliZHpOQWtOeDA3ZEhXTC9ETnZvREd6ZlxcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJtZkwxTXZLTVFtWTdyT1hoWmlramRlUldyeStJUTBZWFpBK1pXd0lEQVFBQkFvSUJBUUNkNUR6QUR5UnNrSWJtXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIkJnNkRrbkJnMTlRR0Q0Rms0Q3lqTXJQRHowUVNHbzFYZ2IvMzJzVzYwK29QWXVDSnNwTWNPL1dFNHJtVUpZWVFcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiTER6Z3RNUHBmSktyakN5RW9VclpIemN4QzA5RUM0OFJuakczNnRXVnJub0ZaVFRRS3p1U1k5SXZONDRNUGJGYlxcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJ1aFhxTldHKzBlZzhuNTIrUjVOc1R6UjBYUE1IU2prYkR1N01vS2ErMys0T295akNsNGxHQ3pWMnB0dmg3cGdlXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcImo0ZjdTYUhTWjFPZG9jNlJEanFqLzRzQ0REOURvQXlteW5iSlg3akpmNDRaR0hIK3lrRktuWTNnWEY1T0F4QkhcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiRVZJd3Z6WkE4T2JuUld4MFZCdFhqSFZ1TG0wWVdMa2EzaVliQUd0cjI0emxxRzVmYjhSQTZwU0xuV2V1cXVXL1xcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJQR2dUcXh2QkFvR0JBUC9jTVlNMHllYVBpcDhsdER6MFNBT0RRWGxid0hNNEhJM3pOaTVvZDM5WW5KdU51US9LXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIkV5WFFQRnY2MWV5SGNZaWRYY0NMc24wa2NQdzB3dVRUZUxXbXJTb1VGN2tBeWpBd1N5MUsrVVNqL2I2Y2pCcjBcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiRmo2Q2Z3OWpPUW1IUTdJdmM4bWVqQkVTUkUyaVVPZ1JZeHdiN0RwOUVXaWRQMDZyTnNsWENjU3hBb0dCQU1Hc1xcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJaMU5sZ3RtWHRxWkxBRUpQdzZ4aEF4QmJIODBrenBVUkIzQUdmNlNMeEVwbjk0dUl5S0RxQUQrZUM3NGJJUjhuXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcImFHMDhNN3V1eEI5YzhTTkhQRzlBMWxqRXo0M1hGdlFKUVhnY3RkQzZoRTJURUgyTDFFY2RkOFZtdEl6ekpPaDhcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiMDdDeGVybHQ2T3hNeWo5ZTM5R1RKZmIwVUNrZG5zdE1MUFhoQnZITEFvR0JBT29lVWkvODNjSmJGajBLQXlMRFxcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJaQ0hTdU5hVFhrWVAwaEVSdTBJNzFSeHh1TnVka3ZrZnJ1V3E1WkJFdGZyNDlLcE5WTHdiRi9mcW9IZ216eThUXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIlVpRGxvdzRkMUpjMFljNDJZcFBQUnNmSVJ5ZGpsOUFTQ1VpcG9CbzBjTHlIU1NxQ3dUQjhJeTU3eUlSQlFrY1hcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwib2RqV3RCSFEzMTBhaGhNMkY2dWtPUXdCQW9HQkFLQUpvYncxTnNJdGJyM05YaUp0blNpMVpYMi9mdkRheUdZL1xcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJreURNRGUvZm1zMU5TaTRnVW9FOXZBVFZ5YWhHN01DOHBMc1hNenlVdHZXZnJKZFZSeWc3c0tQYnhoTFVPT0JoXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIlFadEtSaWQ3Nk5YZGY1UHUxdlFJOHE3Skpzc09KR0tFdTd6WGU2ejhtS3VpN01FZTJkNXBOTWJ6cmNXNzl6clFcXG5cIlxuICAgICAgICAgICAgICAgICAgICArIFwiOEpvaFg4YXZBb0dCQUtWSjhYVytpOGw4V1ZUcnhEZUFqbXQ3dFhyd0U1OEU3eWFXVlNvc0ZpV0RDYU0vV0VZcVxcblwiXG4gICAgICAgICAgICAgICAgICAgICsgXCJoaThIa0ZvNlBSQ2JjRE8xMXZudzB1QlUxTWpITUE4cmRsVXZtdnR6enlYaDVEek02V3l5cWhQeUExdWRDZG80XFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIkhKVnpJdFZ0K1pWdm9xVjFyQnZVUEpoS3VIMzNrSTFIazNMa0FPdDdON0FHc0ZjQzViczY0dEZLXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgKyBcIi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuXCI7XG4gICAgICAgICAgICBnaXRDbGllbnQuZG9GZXRjaChcIi9naXRhcGkvcmVtb3RlL29yaWdpbi9tYXN0ZXIvXCIgKyByZXBvTG9jYXRpb24sIGZhbHNlLCBudWxsLCBudWxsLCBudWxsLCBnaXRQcml2YXRlS2V5LFxuICAgICAgICAgICAgICAgICAgICBudWxsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZ2l0Q2xpZW50LmdldEdpdFJlbW90ZShcIi9naXRhcGkvcmVtb3RlL29yaWdpbi9tYXN0ZXJcIiArIHJlcG9Mb2NhdGlvbikudGhlbihmdW5jdGlvbihyZW1vdGVTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdpdERpZmZEZWZlcnJlZCA6IERlZmVycmVkLklEZWZlcnJlZCA9IGdpdENsaWVudC5kb0dpdERpZmYoXCIvZ2l0YXBpL2RpZmYvXCIgKyByZW1vdGVTdGF0dXMuSWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiLi5IRUFEL1wiICsgcmVwb0xvY2F0aW9uICsgXCI/c2hvd05hbWVBbmRTdGF0dXNPbmx5PXRydWUmcGFydHM9ZGlmZlwiKTtcbiAgICAgICAgICAgICAgICAgICAgRGVmZXJyZWQuYWxsKFtnaXRTdGF0dXNEZWZlcnJlZCwgZ2l0RGlmZkRlZmVycmVkXSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkRmlsZXM6IElGaWxlbmFtZVRvR2l0U3RhdHVzTWFwID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgd2l0aCBnaXQgZGlmZiByZXN1bHQgYmVmb3JlIGFkZGluZyBnaXQgc3RhdHVzIHJlc3VsdHMgc28gc3RhdHVzIGNoYW5nZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBpcyBtb3JlIHJlY2VudCwgb3ZlcndyaXRlcyBkaWZmIGNoYW5nZSB0eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZkZpbGVuYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZXN1bHRbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaWZmRmlsZW5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZGlmZkZpbGVuYW1lc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVXRpbC5SZXNvdXJjZUZvcm1hdHRlci5oYXNEYXRhVGFibGVFeHRlbnNpb24oZmlsZW5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRGaWxlc1tyZXBvTG9jYXRpb24gKyBmaWxlbmFtZV0gPSByZXN1bHRbMV1bZmlsZW5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1c0RhdGE6IE9yaW9uR2l0LlN0YXR1c1Jlc3VsdCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZEdpdFN0YXR1c1Jlc3VsdHMoY2hhbmdlZEZpbGVzLCBzdGF0dXNEYXRhLkFkZGVkLmNvbmNhdChzdGF0dXNEYXRhLlVudHJhY2tlZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yaW9uR2l0LkNoYW5nZVR5cGUuQUREKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZEdpdFN0YXR1c1Jlc3VsdHMoY2hhbmdlZEZpbGVzLCBzdGF0dXNEYXRhLk1pc3NpbmcuY29uY2F0KHN0YXR1c0RhdGEuUmVtb3ZlZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yaW9uR2l0LkNoYW5nZVR5cGUuREVMRVRFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZEdpdFN0YXR1c1Jlc3VsdHMoY2hhbmdlZEZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNEYXRhLkNoYW5nZWQuY29uY2F0KHN0YXR1c0RhdGEuQ29uZmxpY3RpbmcpLmNvbmNhdChzdGF0dXNEYXRhLk1vZGlmaWVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3Jpb25HaXQuQ2hhbmdlVHlwZS5ERUxFVEUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZFJlc3VsdC5yZXNvbHZlKGNoYW5nZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZFJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRGaWxlUmVwbGFjZW1lbnRzKHJlcG9Mb2NhdGlvbjogc3RyaW5nKTogRGVmZXJyZWQuSURlZmVycmVkIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VkRmlsZXM6IElGaWxlbmFtZVRvQ29udGVudE1hcCA9IHsgfTtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZFJlc3VsdCA9IG5ldyBEZWZlcnJlZCgpO1xuXG4gICAgICAgICAgICB0aGlzLmdldENoYW5nZWRGaWxlU3RhdHVzKFwicmVwb1wiKS50aGVuKGZ1bmN0aW9uKGNoYW5nZWRGaWxlU3RhdHVzZXM6IElGaWxlbmFtZVRvR2l0U3RhdHVzTWFwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVEZWZlcnJlZHM6IERlZmVycmVkLklEZWZlcnJlZFtdID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVuYW1lczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICAgICAgICAgIHZhciBmaWxlTG9jYXRpb25zOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGNoYW5nZWRGaWxlU3RhdHVzZXMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZUxvY2F0aW9uID0gZmlsZUxvY2F0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRGaWxlU3RhdHVzZXNbZmlsZUxvY2F0aW9uXSA9PT0gT3Jpb25HaXQuQ2hhbmdlVHlwZS5ERUxFVEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkRmlsZXNbVXRpbC5SZXNvdXJjZUZvcm1hdHRlci5maWxlTG9jYXRpb25Ub0lkKGZpbGVMb2NhdGlvbiwgcmVwb0xvY2F0aW9uKV0gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyBoZXJlIGluIFR5cGVTY3JpcHQgY29udmVyc2lvbiAtLSBkb2VzIFR5cGVzY3JpcHQgc3VwcG9ydCBKYXZhU2NyaXB0IFVSTD9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkwvVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgdXJsID0gbmV3ICg8YW55PiBVUkwoZmlsZUxvY2F0aW9uKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBmaWxlRGVmZXJyZWRzLnB1c2goeGhyKFwiR0VUXCIsIGZpbGVMb2NhdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJPcmlvbi1WZXJzaW9uXCI6IFwiMVwiIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTsgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lcy5wdXNoKFV0aWwuUmVzb3VyY2VGb3JtYXR0ZXIuZmlsZUxvY2F0aW9uVG9JZChmaWxlTG9jYXRpb24sIHJlcG9Mb2NhdGlvbikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gaGFuZGxlIG9wdE9uRXJyb3JcbiAgICAgICAgICAgIC8qIERlZmVycmVkLmFsbChmaWxlRGVmZXJyZWRzKS50aGVuKGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmxlbmd0aCAhPT0gZmlsZW5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHNob3VsZCBuZXZlciBoYXBwZW4uIFN0aWxsLCBoYW5kbGUgaXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkRmlsZXNbZmlsZUxvY2F0aW9uc1tpXV0gPSBjb250ZW50c1tpXS5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmVycmVkUmVzdWx0LnJlc29sdmUoY2hhbmdlZEZpbGVzKTtcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZFJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9