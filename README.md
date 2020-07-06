# servbees-mobile-app


### Setting up dev environment:
 https://reactnative.dev/docs/environment-setup


#### After setup
go to project root\
`yarn install`

#### If using android device/emulator
`npx react-native run-android`

#### If using iOS device/emulator
`cd ios`\
`pod install`\
`cd .. && react-native run-ios`\
or if using Xcode click the run button


#### Notes about git rebase
If you are working on a branch that you want to merge on master make sure to rebase first to avoid merge conflicts.

git checkout master
git pull origin master
git checkout <your-branch-name>
git rebase master

this will resolve the conflict on your branch.