import React from 'react';

function nodeDetails() {
    const styles = {
        form: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '300px',
          margin: 'auto'
        },
        inputGroup: {
          margin: '10px 0'
        },
        label: {
          display: 'block',
          marginBottom: '5px'
        },
        input: {
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box'
        },
        button: {
          padding: '10px 15px',
          marginTop: '10px'
        }
      };

  return (
    <div>
      <form style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">Node Name:</label>
          <input style={styles.input} type="text" name="name" id="name" />
        </div>

        {/* <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="class">:</label>
          <input style={styles.input} type="text" name="class" id="class" />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="section">Section:</label>
          <input style={styles.input} type="text" name="section" id="section" />
        </div> */}

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="type">Type:</label>
          <select style={styles.input} name="type" id="type">
            <option value="type1">Shop</option>
            <option value="type2">Checkpoint</option>
            <option value="type3">Type 3</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="property">Property:</label>
          <select style={styles.input} name="property" id="property">
            <option value="property1">Property 1</option>
            <option value="property2">Property 2</option>
            <option value="property3">Property 3</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label>
            <input type="radio" name="confirm" value="Start Walking" />
            Start Walking
          </label>
          <label>
            <input type="radio" name="confirm" value="End Trip" />
            End Trip
          </label>
        </div>
        <button style={styles.button} type="submit">Save</button>
      </form>
    </div>
  );
}

export default nodeDetails;
