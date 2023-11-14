const getFakePerson = async () => {
    const myHeaders = new Headers();
    myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6");
    myHeaders.append("cache-control", "no-cache");
    myHeaders.append("pragma", "no-cache");
    myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const htmlResponse = await fetch("https://cors-anywhere.herokuapp.com/https://www.fakenamegenerator.com/advanced.php?t=country&n%5B%5D=br&c%5B%5D=br&gen=56&age-min=27&age-max=36", requestOptions).then(response => response.text());
    const html = htmlResponse;
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const infoElement = tempElement.querySelector('.info');
    const addressElement = infoElement.querySelector('.address');
    const name = infoElement.querySelector('h3').textContent;
    const addressText = addressElement.querySelector('.adr').textContent;
    const addressMatches = addressText.match(/(.+),\s*(\d+)(.+)([A-Z]{2})(\d{5}-\d{3})/);
    const address = addressMatches ? addressMatches[1].trim() : '';
    const number = addressMatches ? addressMatches[2] : '';
    const city = addressMatches ? addressMatches[3].slice(0, -1) : '';
    const uf = addressMatches ? addressMatches[4] : '';
    const zipCode = addressMatches ? addressMatches[5] : '';
    const phone = infoElement.querySelector("div > div.extra > dl:nth-child(5) > dd").textContent;
    const countryCode = infoElement.querySelector("div > div.extra > dl:nth-child(6) > dd").textContent;
    const birthday = infoElement.querySelector("div > div.extra > dl:nth-child(8) > dd").textContent;
    const age = infoElement.querySelector("div > div.extra > dl:nth-child(9) > dd").textContent;
    const tropicalZodiac = infoElement.querySelector("div > div.extra > dl:nth-child(10) > dd").textContent;
    infoElement.querySelector("div > div.extra > dl:nth-child(12) > dd > div").remove();
    const emailAddress = infoElement.querySelector("div > div.extra > dl:nth-child(12) > dd").textContent;
    const username = infoElement.querySelector("div > div.extra > dl:nth-child(13) > dd").textContent;
    const password = infoElement.querySelector("div > div.extra > dl:nth-child(14) > dd").textContent;
    const website = infoElement.querySelector("div > div.extra > dl:nth-child(15) > dd").textContent;
    const browserUserAgent = infoElement.querySelector("div > div.extra > dl:nth-child(16) > dd").textContent;
    const company = infoElement.querySelector("div > div.extra > dl:nth-child(22) > dd").textContent;
    const occupation = infoElement.querySelector("div > div.extra > dl:nth-child(23) > dd").textContent;
    const height = infoElement.querySelector("div > div.extra > dl:nth-child(25) > dd").textContent;
    const weight = infoElement.querySelector("div > div.extra > dl:nth-child(26) > dd").textContent;
    const bloodType = infoElement.querySelector("div > div.extra > dl:nth-child(27) > dd").textContent;
    const favoriteColor = infoElement.querySelector("div > div.extra > dl:nth-child(33) > dd").textContent;
    const vehicle = infoElement.querySelector("div > div.extra > dl:nth-child(34) > dd").textContent;
    const guid = infoElement.querySelector("div > div.extra > dl:nth-child(35) > dd").textContent;
    const fakePerson = {
        "ADDRESS": {
            "Name": name,
            "Address": address,
            "Number": number,
            "City": city,
            "UF": uf,
            "Zip Code": zipCode
        },
        "PHONE": {
            "Phone": phone,
            "Country code": countryCode
        },
        "BIRTHDAY": {
            "Birthday": birthday,
            "Age": age,
            "Tropical zodiac": tropicalZodiac
        },
        "ONLINE": {
            "Email Address": emailAddress,
            "Username": username,
            "Password": password,
            "Website": website,
            "Browser user agent": browserUserAgent
        },
        "EMPLOYMENT": {
            "Company": company,
            "Occupation": occupation
        },
        "PHYSICAL CHARACTERISTICS": {
            "Height": height,
            "Weight": weight,
            "Blood type": bloodType
        },
        "OTHER": {
            "Favorite color": favoriteColor,
            "Vehicle": vehicle,
            "GUID": guid
        }
    };
    return fakePerson;
};