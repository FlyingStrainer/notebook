
/**
 * uuid
 * name
 * author
 * dataEntries
 * dateModified
 * dateCreated
 */
class Notebook {
  /**
   * settings
   *   uuid
   *   name
   *   author
   */
  constructor(settings) {
    const dateCreated = new Date();

    Object.assign(this, {
      dateModified: dateCreated,
      dateCreated,
      dataEntries: [],
    });
    Object.assign(this, settings);
  }
}

module.exports = Notebook;
