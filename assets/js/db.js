const MONGOREALM={
    app:null,
    credentials:null,
    user:null,
    load:async function(){        
        this.app = new Realm.App({"id":"kenteachestech-aogrz"});
        this.user = await this.app.logIn( Realm.Credentials.apiKey("1kJWBS1BT0wBxMo7cBYvR9tTxhjWcrDr3gswuU4G28q3onfdSLjqCToKBA8ubVS5") );        
    }
};

