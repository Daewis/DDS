import express from 'express';
import pool from '../db.js';


const router = express.Router();



// Get all deliveries
router.get('/deliveries', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, department, litres, priority, status, requested_by
       FROM deliveries
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});


/* 
// list deliveries
router.get('/deliveries', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM deliveries ORDER BY date DESC');
    res.json(rows.rows);
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});
**/

// Mark a delivery as delivered
router.put('/deliveries/:id/deliver', async (req, res) => {
  try {
    await pool.query(
      `UPDATE deliveries SET status = 'Delivered' WHERE id = $1`,
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});


/*
// update status
router.put('/deliveries/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!['pending','in_transit','delivered'].includes(status)) {
      return res.status(400).json({ error: 'invalid_status' });
    }
    const updated = await pool.query('UPDATE deliveries SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    if (!updated.rowCount) return res.status(404).json({ error: 'not_found' });
    const row = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    res.json(row.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});
**/
// create order (maps to deliveries table)
router.post('/orders', async (req, res) => {
  try {
    const { department, liters, priority, date } = req.body;
    if (!department || !liters || !priority || !date) {
      return res.status(400).json({ error: 'missing_fields' });
    }
    const { rows } = await pool.query(
      'INSERT INTO deliveries (status, department, litres, priority, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['pending', department, litres, priority, date]
    );
    const [id] = rows;
    const newRow = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    res.status(201).json(newRow.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});

// stats
router.get('/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) as cnt FROM deliveries');
    const pending = await pool.query('SELECT COUNT(*) as cnt FROM deliveries WHERE status = $1', ['pending']);
    const in_transit = await pool.query('SELECT COUNT(*) as cnt FROM deliveries WHERE status = $1', ['in_transit']);
    const delivered = await pool.query('SELECT COUNT(*) as cnt FROM deliveries WHERE status = $1', ['delivered']);
    res.json({
      total: total.rows[0].cnt,
      pending: pending.rows[0].cnt,
      in_transit: in_transit.rows[0].cnt,
      delivered: delivered.rows[0].cnt
    });
  } catch (err) {
    res.status(500).json({ error: 'db_error' });
  }
});

export default router;
