// Get Access Token
// 也可以对已存在的变量进行赋值（表达式必须包含在括号里,省去标识符let const）

let accessToken;
async function getAccessToken() {
  console.info(`当前Token:${accessToken}`);
  const url = `https://api.weixin.qq.com/cgi-bin/token`;
  const params = {
    // 398871200@qq.com账号
    grant_type: "client_credential",
    appid: "wx176273755a0fb430",
    secret: "677b1fb96b482c42ce47be2827c921e5",
  };
  ({
    data: { access_token: accessToken },
  } = await axios.get(url, { params }));
}
getAccessToken();
