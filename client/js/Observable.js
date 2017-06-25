export class Observable {

    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(
            observer => observer.update());
    }
}