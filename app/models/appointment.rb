class Appointment < ApplicationRecord
  validates :title, :appt_time, presence: true
  validates :title, length: { minimum: 3 }
  validate :appt_time_cannot_be_in_past

  private

  def appt_time_cannot_be_in_past
    return unless appt_time.present? && appt_time < Time.zone.now
    errors.add(:appt_time, "can't be in the past")
  end
end
