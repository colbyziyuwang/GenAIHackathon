class CalendarItem {
  constructor(id, title, description="") {
    /**
     * @param {string} id
     * @param {string} title
     * @param {string} description
     * 
     * Example:
     *  let item = new CalendarItem("Meeting", "Discuss project", new Date());
     */
    this.title = title;
    this.description = description;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
    };
  }

  static fromJSON(json) {
    return new CalendarItem(json.id, json.title, json.description);
  }

  getDate() { return this.date; }
}

class Event extends CalendarItem {
  constructor(id, title, startTime, endTime, description="", location="") {
    /**
     * @param {string} title
     * @param {string} description
     * @param {Date} startTime: start time of the event (set to 23:59:59 to denote end of day)
     * @param {Date} endTime: end time of the event (set to 23:59:59 to denote end of day)
     * @param {string} location: location of the event
     */
    super(id, title, description);

    this.startTime = startTime;
    this.endTime = endTime;
    this.location = location;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      location: this.location,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  static fromJSON(json) {
    return new Event(
      json.id,  
      json.title,
      json.startTime,
      json.endTime,
      json.description,
      json.location);
  }
}

class Task extends CalendarItem {
  constructor(title, deadline, description="") {
    /**
     * @param {string} title
     * @param {string} description
     * @param {Date} deadline: deadline of the task (set to 23:59:59 to denote end of day)
     */
    super(title, description);
    this.deadline = deadline;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      deadline: this.deadline,
    };
  }

  static fromJSON(json) {
    return new Task(
      json.id,
      json.title,
      json.deadline,
      json.description);
  }
}
