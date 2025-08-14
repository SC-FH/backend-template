type $busType = {
    events: {
        [key: string]: Array<(...args: any[]) => any>
    },
    on(eventName: string, callback: (...args: any[]) => any): void,
    on(eventNameList: string[], callback: (...args: any[]) => any): void,

    off(eventName: string, callback?: () => any): void,
    off(eventNameList: string[], callback?: () => any): void,

    emit(eventName: string, ...args: any[]): void
    emit(eventNameList: string[], ...args: any[]): void
}
const $bus: $busType = {
    events: {},
    on(eventName, callback) {
        let eventNameList = []
        if (typeof eventName === 'object') {
            eventNameList = eventName
        } else {
            eventNameList = [eventName]
        }

        for (let eventName of eventNameList) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        }
    },
    off(eventName, callback) {
        let eventNameList = []
        if (typeof eventName === 'object') {
            eventNameList = eventName
        } else {
            eventNameList = [eventName]
        }

        for (let eventName of eventNameList) {
            if (!this.events[eventName]) return;
            if (!callback) {
                delete this.events[eventName];
                return;
            }
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    },
    emit(eventName, ...args) {
        let eventNameList = []
        if (typeof eventName === 'object') {
            eventNameList = eventName
        } else {
            eventNameList = [eventName]
        }
        for (let eventName of eventNameList) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(callback => callback(...args));
            }
        }
    }
}
export default $bus;