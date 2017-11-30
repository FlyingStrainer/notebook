
/**
 * uuid
 * name
 * managerList
 * dateModified
 * dateCreated
 * tagList
 * dataEntryList
 */
class Notebook {
  /**
   * settings
   *   uuid
   *   name
   *   managerList
   */
  constructor(settings) {
    const date_created = new Date();

    Object.assign(this, {
      date_modified: date_created,
      date_created,
      tags: [],
      data_entries: [],
    });
    Object.assign(this, settings);
  }
}

module.exports = Notebook;
