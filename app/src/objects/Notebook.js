
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
    const dateCreated = new Date();

    Object.assign(this, {
      dateModified: dateCreated,
      dateCreated,
      tagList: [],
      dataEntries: [],
    });
    Object.assign(this, settings);
  }
}

module.exports = Notebook;
