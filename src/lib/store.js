const store = (data = {}, name = 'store') => {
    return new Proxy(data, {
        get: (target, prop) => target[prop],
        set: (target, prop, value) => {
            if (target[prop] === value) return true;
            target[prop] = value;
            return true;
        },
        deleteProperty: (target, prop) => {
            delete target[prop];
            return true;
        }
    })
}

const gatewayStore = store({
    session_id: "",
    resume_gateway_url: "",
    seq: 0,
}, 'gateway');

export default gatewayStore;