export class NoteService {

    saveOrUpdate(id, note) {
        if (!id) {
            return this.save(note);
        } else {
            return this.update(id, note);
        }
    }

    save(note) {
        return fetch("notes",
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(note)
            })
            .then(this.handleErrors)
            .then(response => response.json())
            .catch(error => alert(error));
    }

    update(id, note) {
        return fetch(`notes/${id}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(note)
            })
            .then(this.handleErrors)
            .then(response => response.json())
            .catch(error => alert(error));
    }

    getAll() {
        return fetch("notes")
            .then(this.handleErrors)
            .then(response => response.json())
            .catch(error => alert(error));
    }

    getById(id) {
        return fetch(`notes/${id}`)
            .then(this.handleErrors)
            .then(response => response.json())
            .catch(error => alert(error));
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}