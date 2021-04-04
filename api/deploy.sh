functionName=Rest_Api_Lambda
rm -rf ../lambda.zip
node build.js || { echo 'Build failed' ; exit 1; }
zip -r9 ../lambda.zip * -x "*.git*" -x "*.marko" -x "server.js" -x "*.sh" -x "assets*" -x "build.js"
cd ..
aws lambda --region ap-south-1 update-function-code --zip-file fileb://lambda.zip  --function-name $functionName
cd -