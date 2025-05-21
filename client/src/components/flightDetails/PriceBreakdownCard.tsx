import { Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material"
import { PriceSummary, TravelerPricingInfo } from "../../types/FlightSearchResponseTypes"

import PaymentsIcon from '@mui/icons-material/Payments'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'


interface PriceBreakdownCardProps {
  summary: PriceSummary
  travelerPricings?: TravelerPricingInfo[] | null
}
const PriceBreakdownCard: React.FC<PriceBreakdownCardProps> = ({ summary, travelerPricings }) => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, position: { md: 'sticky' }, top: { md: '20px' } }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <PaymentsIcon sx={{ mr: 1 }} /> Price Breakdown
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Currency: {summary.currencyName || summary.currencyCode} ({summary.currencyCode})
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="Base Price:" secondary={summary.basePrice || 'N/A'} />
        </ListItem>
        {summary.fees?.map((fee, index) => (
          <ListItem key={`fee-${index}`}>
            <ListItemText primary={`${fee.type || 'Fee'}:`} secondary={fee.amount} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} component="li" />
        <ListItem sx={{ py: 2 }}>
          <ListItemText
            primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            secondaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            primary="Total Price:"
            secondary={summary.totalPrice} />
        </ListItem>
      </List>
      {travelerPricings && travelerPricings.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Price per Traveler:</Typography>
          <List dense>
            {travelerPricings.map((tp, index) => (
              <ListItem key={`travelerprice-${index}`}>
                <ListItemIcon sx={{ minWidth: '30px' }}><LocalOfferIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={`${tp.travelerType || 'Traveler'} ${tp.travelerId}:`} secondary={`${tp.totalPrice || 'N/A'} ${tp.currencyCode || summary.currencyCode}`} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  )
}

export default PriceBreakdownCard
